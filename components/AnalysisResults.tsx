
import React, { useState } from 'react';
import { AnalysisResult, SeverityLevel, Specimen } from '../types';
import { Brain, Eye, AlertCircle, Layers, Camera, Download, Fingerprint, Activity, ShieldCheck, Database, Cpu, Info, CheckCircle2, Sprout, FlaskConical, Droplet, ShieldAlert, XCircle, CheckCircle, Lightbulb, Thermometer, Wind, Cloud, Loader2 } from 'lucide-react';
import { generateInstitutionalReport } from '../services/pdfService';

interface AnalysisResultsProps {
  result: AnalysisResult;
  image: string;
  onReset: () => void;
  onViewSpecimens: () => void;
  onSave?: () => Promise<void>;
  specimens?: Specimen[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  result, image, onReset, onViewSpecimens, onSave, specimens = []
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  if (!result) return null;

  const getSeverityStyles = (level: string) => {
    switch (level?.toLowerCase()) {
      case SeverityLevel.LOW: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case SeverityLevel.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
      case SeverityLevel.HIGH: return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleSaveClick = async () => {
    if (onSave && !hasSaved) {
      setIsSaving(true);
      await onSave();
      setIsSaving(false);
      setHasSaved(true);
    }
  };

  const hasNeuralMismatch = result.cnnLayerInsights && result.cnnLayerInsights.predictedClass !== result.diseaseName;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Institutional Note Banner */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 text-blue-700 text-xs font-bold uppercase tracking-wider">
        <Info size={16} /> [INSTITUTIONAL DEMO] Neural weights and classification logic are validated for technical demonstration.
      </div>

      <div className="diagnostic-banner bg-slate-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden text-white transition-all duration-500">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ShieldCheck size={240} /></div>
        <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${
              result.mode === 'NEURAL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}>
              {result.mode === 'NEURAL' ? <Cpu size={12} /> : <Database size={12} />}
              {result.mode} PROTOCOL
            </span>
            {result.fallbackUsed && (
              <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 animate-pulse">
                Fallback Used: CNN Connectivity Restricted
              </span>
            )}
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="space-y-4">
            <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">VTU Research Prototype</span>
            <h2 className="text-7xl font-black tracking-tighter leading-none">{result.diseaseName}</h2>
            <p className="text-2xl text-emerald-100/80 font-medium italic">{result.scientificName}</p>
          </div>
          <div className="flex flex-col lg:items-end gap-4">
             <div className="flex items-baseline gap-3">
                <span className="text-6xl font-black text-emerald-400">{(result.confidence * 100).toFixed(0)}%</span>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Confidence Index</span>
             </div>
             <div className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border-2 ${getSeverityStyles(result.severity)} border-opacity-30 backdrop-blur-md`}>
                {result.severity} Risk Potential <span className="emoji-glyph">⚠️</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative group rounded-[3.5rem] overflow-hidden shadow-xl bg-black aspect-square border-4 border-slate-900 transition-colors">
          <img 
            src={image} 
            className="w-full h-full object-cover transition-opacity duration-500" 
            alt="Specimen Source"
          />
          <div className="absolute inset-x-0 bottom-8 flex justify-center px-6">
            <div className="w-full max-w-sm py-5 bg-white/95 text-slate-900 rounded-[2rem] font-black text-[11px] flex items-center justify-center gap-3 border border-slate-200 backdrop-blur">
              <Camera size={18} className="text-emerald-500" /> SOURCE VALIDATION FRAME
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-slate-900 font-black text-3xl mb-8 flex items-center gap-4">
             <Brain className="text-[#064e3b]" /> Expert Evaluation
          </h3>
          
          <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10">{result.explanation}</p>

          <div className="bg-slate-50 rounded-3xl p-6 mb-10 border border-slate-200">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Lightbulb size={14} className="text-amber-500" /> Strategic Outlook
             </h4>
             <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                "{result.riskSynthesis}"
             </p>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-4">
            {onSave && (
              <button 
                onClick={handleSaveClick}
                disabled={isSaving || hasSaved}
                className={`flex-1 py-5 rounded-[1.8rem] font-black text-[11px] shadow-lg transition-all flex items-center justify-center gap-3 ${
                  hasSaved 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : hasSaved ? (
                  <CheckCircle size={18} />
                ) : (
                  <Database size={18} />
                )}
                {isSaving ? "SYNCING TO ATLAS..." : hasSaved ? "SAVED TO CLOUD" : "SAVE DETECTION"}
              </button>
            )}
            <button onClick={() => generateInstitutionalReport(result, image)} className="flex-1 py-5 bg-[#064e3b] text-white rounded-[1.8rem] font-black text-[11px] shadow-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-3">
              <Download size={18} /> THESIS REPORT
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-10 border-t pt-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[#064e3b] font-black text-[10px] uppercase tracking-[0.4em]">Protocol Layer 03</span>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Advanced Management Protocols</h3>
          </div>
          <div className="hidden lg:flex gap-4">
             <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-3">
                <Thermometer size={16} className="text-rose-500" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Target Temp: {result.environmentalThresholds.idealTemp}</span>
             </div>
             <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-3">
                <Wind size={16} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-600 uppercase">Target RH: {result.environmentalThresholds.idealHumidity}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Sprout size={24} />
              </div>
              <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Cultural Management</h4>
            </div>
            <ul className="space-y-3">
              {result.detailedRecommendations.cultural.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <FlaskConical size={24} />
              </div>
              <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Biological Control</h4>
            </div>
            <ul className="space-y-3">
              {result.detailedRecommendations.biological.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                <Droplet size={24} />
              </div>
              <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Chemical Intervention</h4>
            </div>
            <ul className="space-y-3">
              {result.detailedRecommendations.chemical.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10"><CheckCircle size={120} /></div>
             <h4 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
               <ShieldCheck className="text-emerald-400" /> Immediate Critical Actions
             </h4>
             <ul className="space-y-4 relative z-10">
               {result.detailedRecommendations.immediate.map((item, i) => (
                 <li key={i} className="flex items-start gap-4 text-emerald-50 text-sm font-bold bg-white/5 p-4 rounded-2xl border border-white/5">
                   <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                   {item}
                 </li>
               ))}
             </ul>
           </div>

           <div className="bg-rose-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10"><XCircle size={120} /></div>
             <h4 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
               <ShieldAlert className="text-rose-400" /> Strictly Prohibited Actions
             </h4>
             <ul className="space-y-4 relative z-10">
               {result.detailedRecommendations.prohibited.map((item, i) => (
                 <li key={i} className="flex items-start gap-4 text-rose-50 text-sm font-bold bg-white/5 p-4 rounded-2xl border border-white/5">
                   <XCircle size={18} className="text-rose-400 shrink-0" />
                   {item}
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </section>

      <div className="flex justify-center pt-16">
        <button 
          onClick={onReset}
          className="bg-white border-2 border-slate-200 hover:border-[#064e3b] text-slate-900 font-black py-6 px-20 rounded-[2.5rem] shadow-xl transition-all active:scale-95 flex items-center gap-4 group"
        >
          <Camera size={22} className="group-hover:text-emerald-600" /> RESET SENSOR ARRAY
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
