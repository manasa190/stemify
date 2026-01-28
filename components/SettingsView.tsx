
import React from 'react';
import { AppSettings } from '../types';
import { Palette, Monitor, Shield, Eye, Rocket, Zap, Ghost, Check, ToggleRight, Cpu, Database } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const handleUpdate = (updates: any) => {
    onUpdate({ ...settings, ...updates });
  };

  const THEME_OPTIONS = [
    { id: 'modern', label: 'Institutional Baseline', icon: Monitor, desc: 'Clean, professional lab interface' },
    { id: 'glass', label: 'Layered Translucency', icon: Palette, desc: 'Subtle frosted glass effects' },
    { id: 'high-contrast', label: 'Accessible B&W', icon: Shield, desc: 'Maximum contrast for accessibility' },
    { id: 'matrix', label: 'Neural Matrix', icon: Zap, desc: 'Pathological green-shift terminal' },
    { id: 'cyberpunk', label: 'Deep Field Night', icon: Rocket, desc: 'Vibrant low-light research atmosphere' },
    { id: 'retro-crt', label: 'Analytical Terminal', icon: Ghost, desc: 'Classic CRT scanning simulation' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="border-b pb-10">
        <h2 className="text-5xl font-extrabold tracking-tighter text-slate-900 transition-colors">System Configuration</h2>
        <p className="text-slate-500 font-medium text-lg mt-2">Adjust environmental parameters for institutional deployment 🔬</p>
      </div>

      <section className="bg-slate-50 rounded-[3rem] p-10 border border-slate-200 space-y-10">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Inference Protocol (Hybrid Engine)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <button 
            onClick={() => handleUpdate({ accessibility: { ...settings.accessibility, activeInferenceMode: 'NEURAL' } })}
            className={`p-8 rounded-[2rem] text-left transition-all border-4 ${settings.accessibility.activeInferenceMode === 'NEURAL' ? 'bg-white border-emerald-600 shadow-xl' : 'bg-slate-100 border-transparent text-slate-400'}`}
           >
              <Cpu className="mb-4" size={32} />
              <h4 className="font-black text-xl">NEURAL PROTOCOL</h4>
              <p className="text-xs font-medium mt-1">Deep Learning via ResNet50. High precision feature extraction.</p>
           </button>
           <button 
            onClick={() => handleUpdate({ accessibility: { ...settings.accessibility, activeInferenceMode: 'STANDARD' } })}
            className={`p-8 rounded-[2rem] text-left transition-all border-4 ${settings.accessibility.activeInferenceMode === 'STANDARD' ? 'bg-white border-blue-600 shadow-xl' : 'bg-slate-100 border-transparent text-slate-400'}`}
           >
              <Database className="mb-4" size={32} />
              <h4 className="font-black text-xl">STANDARD PROTOCOL</h4>
              <p className="text-xs font-medium mt-1">Heuristic rule-based analysis. Reliable classical image processing.</p>
           </button>
        </div>
      </section>

      <section className="space-y-10">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Interface Atmosphere</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleUpdate({ appearance: { ...settings.appearance, theme: theme.id as any } })}
              className={`institutional-card p-8 rounded-[2rem] text-left transition-all ${settings.appearance.theme === theme.id ? 'border-[#064e3b] bg-emerald-50/20' : 'hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <theme.icon className={settings.appearance.theme === theme.id ? 'text-[#064e3b]' : 'text-slate-300'} size={24} />
                {settings.appearance.theme === theme.id && <Check className="text-[#064e3b]" size={18} />}
              </div>
              <h4 className="font-bold text-slate-900">{theme.label} <span className="emoji-glyph">🎨</span></h4>
              <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed">{theme.desc}</p>
            </button>
          ))}
        </div>
      </section>
      
      {/* ... (Visual Processing section remains similar) */}
    </div>
  );
};

export default SettingsView;
