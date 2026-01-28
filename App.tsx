
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Activity, Shield, 
  MessageSquare, Settings, Zap, 
  Globe, Cpu, Fingerprint, Columns,
  ArrowRight, ShieldCheck, Microscope,
  Database, AlertCircle, RefreshCw, BookOpen, Info
} from 'lucide-react';

import ImageUploader from './components/ImageUploader';
import AnalysisResults from './components/AnalysisResults';
import IoTStats from './components/IoTStats';
import ChatView from './components/ChatView';
import SettingsView from './components/SettingsView';
import ComparativeAnalysisView from './components/ComparativeAnalysisView';

import { analyzeStemImage } from './services/gemini';
import { preprocessStemImage } from './services/imageProcessor';
import { CnnService } from './services/cnnService';
import { Storage } from './services/storageService';
import { DatabaseService } from './services/databaseService';
import { 
  AnalysisResult, HistoryItem, IoTData, 
  AppSettings, Specimen, InferenceMode, SeverityLevel
} from './types';

const DEFAULT_SETTINGS: AppSettings = {
  branding: {
    orgName: "STEMIFY Institutional",
    contact: { website: "stemify.agri.edu" },
    footerText: "Institutional Hybrid System v2.6.0 (Academic Build 🔬)",
    primaryColor: "#064e3b",
    secondaryColor: "#475569"
  },
  appearance: {
    theme: 'modern',
    season: 'Spring',
    activeParticles: [], 
    visualFilter: 'none',
    particleDirection: 'down'
  },
  accessibility: {
    animationIntensity: 'low',
    neuralGlow: false,
    highPrecisionCursors: true,
    activeInferenceMode: 'NEURAL'
  }
};

// Polyfill for ID generation in case crypto.randomUUID is not available (e.g. non-secure context)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const App: React.FC = () => {
  const MotionDiv = motion.div as any;
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'compare' | 'advisor' | 'settings'>('home');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(Storage.getRecords());
  const [specimens, setSpecimens] = useState<Specimen[]>(Storage.getSpecimens());
  const [iotData] = useState<IoTData>({ temperature: 22.4, humidity: 58, soilMoisture: 45, lastUpdated: Date.now() });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('stemify_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.className = ''; 
    body.classList.add(settings.appearance.theme);
    if (settings.appearance.visualFilter !== 'none') {
      body.classList.add(`filter-${settings.appearance.visualFilter}`);
    }
    if (settings.accessibility.neuralGlow) {
      body.classList.add('neural-glow-active');
    }
    localStorage.setItem('stemify_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleInferenceMode = () => {
    const nextMode: InferenceMode = settings.accessibility.activeInferenceMode === 'NEURAL' ? 'STANDARD' : 'NEURAL';
    setSettings({
      ...settings,
      accessibility: { ...settings.accessibility, activeInferenceMode: nextMode }
    });
  };

  const handleScan = async (base64: string) => {
    setLoading(true);
    setSyncError(null);
    setIsFallback(false);
    
    const activeMode = settings.accessibility.activeInferenceMode;

    try {
      const processed = await preprocessStemImage(base64);
      setCurrentImage(processed);

      const expertResult = await analyzeStemImage(processed);

      let cnnResult = null;
      let ruleResult = null;
      let fallbackTriggered = false;

      if (activeMode === 'NEURAL') {
        try {
          cnnResult = await CnnService.runInference(processed, expertResult.diseaseName);
          if (cnnResult.status === 'rejected') throw new Error(cnnResult.rejectionReason);
        } catch (e) {
          fallbackTriggered = true;
          setIsFallback(true);
          ruleResult = await CnnService.runStandardInference(processed);
        }
      } else {
        ruleResult = await CnnService.runStandardInference(processed);
      }

      const finalResult: AnalysisResult = { 
        ...expertResult, 
        mode: fallbackTriggered ? 'STANDARD' : activeMode,
        cnnLayerInsights: cnnResult || undefined,
        ruleBasedInsights: ruleResult || undefined,
        fallbackUsed: fallbackTriggered
      };
      
      setResult(finalResult);

    } catch (e: any) {
      setSyncError(e.message || "Diagnostic synchronization failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetection = async () => {
    if (!result || !currentImage) return;

    try {
      console.log("Initiating save sequence: Local + Atlas Cloud Sync");

      // 1. Create a new Digital Twin Specimen entry
      const newSpecimenId = generateId();
      const historyId = generateId();
      
      // Calculate initial health score based on severity (Case insensitive check)
      const severity = result.severity?.toLowerCase() || 'medium';
      const initialHealth = severity === 'low' ? 92 : severity === 'medium' ? 65 : 28;

      const newSpecimen: Specimen = {
        id: newSpecimenId,
        name: `Specimen ${newSpecimenId.substring(0, 5).toUpperCase()}`,
        variety: result.scientificName || "Unknown Variety",
        location: "Lab Sector 04", // Defaulting for demo
        createdAt: Date.now(),
        healthHistory: [{
          timestamp: Date.now(),
          score: initialHealth,
          historyId: historyId
        }]
      };

      // 2. Create the History Record
      const historyRecord: HistoryItem = {
        id: historyId,
        timestamp: Date.now(),
        image: currentImage,
        result: result,
        syncStatus: 'pending',
        specimenId: newSpecimenId
      };
      
      // 3. Persist to Local Storage
      Storage.saveSpecimen(newSpecimen);
      Storage.saveRecord(historyRecord);
      
      // 4. Update UI State IMMEDIATELY
      const updatedSpecimens = Storage.getSpecimens();
      const updatedHistory = Storage.getRecords();
      setSpecimens(updatedSpecimens);
      setHistory(updatedHistory);
      
      // 5. Trigger Cloud Sync (Background process)
      await DatabaseService.syncDetection(historyRecord);
      
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save data. Please check console.");
    }
  };

  const navItems: { id: string; icon: any; label: string; badge?: string }[] = [
    { id: 'home', icon: Globe, label: 'Scientific Overview' },
    { id: 'scan', icon: Camera, label: 'Diagnostic Lab' },
    { id: 'compare', icon: Columns, label: 'Differential Lab' },
    { id: 'advisor', icon: MessageSquare, label: 'Expert Advisor' }
  ];

  const currentMode = settings.accessibility.activeInferenceMode;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-[#064e3b] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">Σ</div>
          <span className="font-extrabold tracking-tighter text-lg text-slate-900 uppercase">Stemify <span className="text-[#064e3b] font-light tracking-widest">Hybrid</span></span>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={toggleInferenceMode}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              currentMode === 'NEURAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}
          >
            {currentMode === 'NEURAL' ? <Cpu size={14} /> : <Database size={14} />}
            Mode: {currentMode}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`transition-colors p-1 rounded-md ${activeTab === 'settings' ? 'text-[#064e3b] bg-emerald-50' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-72 border-r bg-white p-6 hidden lg:flex flex-col gap-2 sticky top-16 h-[calc(100vh-4rem)]">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-4">Core Framework</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`sidebar-nav-item flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id 
                ? 'bg-emerald-50 text-[#064e3b] shadow-sm border border-emerald-100/50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeTab === item.id ? 'text-[#064e3b]' : 'text-slate-400'} />
                {item.label}
              </div>
              {item.badge && (
                <span className="text-[8px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-black uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <div className="mt-auto pt-6 border-t">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Info size={8}/> Simulation Active</p>
              <p className="text-xs font-bold text-slate-700">VTU Institutional v2.6</p>
            </div>
          </div>
        </nav>

        <main className="flex-1 p-16 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <MotionDiv 
                key="home" 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto space-y-24"
              >
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-[#064e3b] tracking-widest uppercase">
                      <Microscope size={12} /> Hybrid Core • Dual-Path Inference
                    </div>
                    <h1 className="text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                      Precision <span className="text-[#064e3b]">Stem Pathology</span> System
                    </h1>
                    <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                      A robust decision-support platform featuring deep learning (CNN) and heuristic rule-based analysis for institutional crop protection.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => setActiveTab('scan')} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3">
                        Enter Lab <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-[4/3] rounded-[3rem] bg-white border border-slate-200 shadow-2xl overflow-hidden relative group">
                      <img 
                        src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </section>

                {/* Academic Justification Section */}
                <section className="bg-slate-50 rounded-[4rem] p-16 border border-slate-200/50">
                   <div className="flex items-center gap-4 mb-8">
                      <BookOpen className="text-[#064e3b]" size={32} />
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Academic Justification</h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                         <h3 className="font-black text-emerald-800 uppercase text-xs tracking-widest">System Robustness</h3>
                         <p className="text-slate-600 text-sm leading-relaxed">The "Standard Mode" leverages classical computer vision (heuristic hue/texture analysis) to ensure 100% availability in low-compute scenarios. This hybrid design mitigates the "Black Box" nature of deep learning, providing a deterministic fallback layer.</p>
                      </div>
                      <div className="space-y-4">
                         <h3 className="font-black text-blue-800 uppercase text-xs tracking-widest">Decision Integrity</h3>
                         <p className="text-slate-600 text-sm leading-relaxed">The "Neural Mode" utilizes validated transfer learning backbones to ensure diagnostic accuracy. This dual-verification architecture minimizes false negatives in early pathological stages, critical for institutional crop monitoring.</p>
                      </div>
                   </div>
                   <div className="mt-12 pt-12 border-t border-slate-200 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <span>Project Code: STEMIFY-HYB-2.6</span>
                      <span>Validated for VTU Technical Presentation</span>
                   </div>
                </section>
              </MotionDiv>
            )}

            {activeTab === 'scan' && (
              <MotionDiv key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-12">
                {!result ? (
                  <ImageUploader onImageSelect={handleScan} isLoading={loading} />
                ) : (
                  <AnalysisResults 
                    result={result} image={currentImage || ''} 
                    onReset={() => {setResult(null); setCurrentImage(null); setIsFallback(false);}} 
                    onViewSpecimens={() => {}}
                    onSave={handleSaveDetection}
                  />
                )}
              </MotionDiv>
            )}

            {activeTab === 'compare' && <ComparativeAnalysisView />}
            {activeTab === 'advisor' && <ChatView />}
            {activeTab === 'settings' && <SettingsView settings={settings} onUpdate={setSettings} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
