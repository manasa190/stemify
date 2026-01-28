
import React, { useState } from 'react';
import { Upload, Zap, ArrowRight, ShieldAlert, BarChart3, TrendingDown, Users } from 'lucide-react';
import { analyzeComparativeStems } from '../services/gemini';
import { ComparativeAnalysisResult } from '../types';

const ComparativeAnalysisView: React.FC = () => {
  const [imgA, setImgA] = useState<string | null>(null);
  const [imgB, setImgB] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparativeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'A') setImgA(reader.result as string);
        else setImgB(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!imgA || !imgB) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeComparativeStems(imgA, imgB);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to compare stems.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-24">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tighter text-slate-900">Pathological Comparison Lab</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">Upload two specimen images to perform advanced differential diagnosis and field risk assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subject A */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-emerald-600 block">Subject A (Reference)</label>
          <div className="relative aspect-square rounded-[3rem] bg-white border-4 border-slate-100 overflow-hidden group">
            {imgA ? (
              <img src={imgA} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center cursor-pointer" onClick={() => document.getElementById('fileA')?.click()}>
                <Upload className="text-slate-300 mb-4" size={48} />
                <p className="text-sm font-bold text-slate-400">SELECT IMAGE A</p>
              </div>
            )}
            <input id="fileA" type="file" className="hidden" onChange={(e) => handleUpload(e, 'A')} />
            {imgA && <button onClick={() => setImgA(null)} className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg">✕</button>}
          </div>
        </div>

        {/* Subject B */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-blue-600 block">Subject B (Variant)</label>
          <div className="relative aspect-square rounded-[3rem] bg-white border-4 border-slate-100 overflow-hidden group">
            {imgB ? (
              <img src={imgB} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center cursor-pointer" onClick={() => document.getElementById('fileB')?.click()}>
                <Upload className="text-slate-300 mb-4" size={48} />
                <p className="text-sm font-bold text-slate-400">SELECT IMAGE B</p>
              </div>
            )}
            <input id="fileB" type="file" className="hidden" onChange={(e) => handleUpload(e, 'B')} />
            {imgB && <button onClick={() => setImgB(null)} className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg">✕</button>}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={runAnalysis}
          disabled={loading || !imgA || !imgB}
          className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-4"
        >
          {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Zap />}
          COMPARE PATHOLOGIES
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 animate-in fade-in zoom-in-95 duration-500">
          {/* Main Difference Card */}
          <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 border border-slate-100 shadow-xl space-y-10">
            <div className="flex justify-between items-start border-b border-slate-50 pb-10">
              <div className="space-y-2">
                <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">Biometric Delta</span>
                <h3 className="text-4xl font-black text-slate-900 leading-tight">{result.subjectA_Diagnosis} vs {result.subjectB_Diagnosis}</h3>
              </div>
              <div className={`px-8 py-4 rounded-[2rem] font-black text-xs flex items-center gap-3 ${result.higherRiskSubject === 'Subject A' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'} border`}>
                <ShieldAlert size={18} /> CRITICAL: {result.higherRiskSubject} AT RISK
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900">
                  <BarChart3 className="text-blue-500" size={24} />
                  <h4 className="font-black text-lg">Visual Divergence</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">{result.visualDifferences}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900">
                  <TrendingDown className="text-rose-500" size={24} />
                  <h4 className="font-black text-lg">Progression Delta</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">{result.progressionComparison}</p>
              </div>
            </div>
          </div>

          {/* Risk Card */}
          <div className="bg-slate-900 rounded-[4rem] p-12 text-white space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10"><ShieldAlert size={140} /></div>
            <h3 className="text-2xl font-black relative z-10 flex items-center gap-3">
              <Zap className="text-amber-400" /> Differential Risk
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur">
                <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">Growth & Yield Prognosis</p>
                <p className="text-sm font-medium leading-relaxed text-slate-300">{result.impactOnGrowthAndYield}</p>
              </div>

              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur">
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Likelihood of Spread</p>
                <div className="flex items-start gap-3">
                  <Users className="text-blue-400 mt-1" size={16} />
                  <p className="text-sm font-medium leading-relaxed text-slate-300">{result.likelihoodOfSpread}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">PATHOLOGICAL JUSTIFICATION</p>
                <p className="text-xs text-slate-400 italic font-medium">"{result.riskReasoning}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparativeAnalysisView;
