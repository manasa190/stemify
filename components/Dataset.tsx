
import React from 'react';
import { KAGGLE_DATASETS, LABEL_MAPPING } from '../constants';

const Dataset: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-800">Institutional Dataset</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ML Lifecycle: Steps 1–6 (Ingestion to Preprocessing)</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] shadow-md border border-slate-100 flex items-center gap-6">
           <div className="text-right">
             <span className="text-2xl font-black text-emerald-600">9,550</span>
             <p className="text-[8px] font-black uppercase text-slate-400">Validated Samples</p>
           </div>
           <div className="w-px h-8 bg-slate-100" />
           <div className="text-right">
             <span className="text-2xl font-black text-blue-600">6</span>
             <p className="text-[8px] font-black uppercase text-slate-400">Class Labels</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KAGGLE_DATASETS.map((ds, i) => (
          <div key={i} className="group bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
               <span className="text-5xl font-black">#{ds.label}</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">{ds.name}</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[8px] font-mono break-all leading-relaxed">
                <p className="text-emerald-600 font-black mb-1">Source:</p>
                {ds.url}
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-[8px] font-mono text-slate-500 leading-relaxed">
                <p className="text-slate-400 font-black mb-1">KaggleHub:</p>
                {ds.loading}
              </div>
              <div className="flex justify-between items-center px-2 pt-2">
                 <div className="text-center">
                    <p className="text-[7px] font-black text-slate-400 uppercase">Count</p>
                    <p className="text-base font-black text-slate-700">{ds.count}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[7px] font-black text-slate-400 uppercase">Label</p>
                    <p className="text-base font-black text-blue-600">ID {ds.label}</p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black flex items-center gap-3">
             <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
             Standardization (Step 3)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LABEL_MAPPING.map((m, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-[11px] text-slate-600">
                {m}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-7xl">🏗️</div>
          <h3 className="text-xl font-black mb-8 text-slate-800">Preprocessing Specs (Step 6)</h3>
          <div className="space-y-5">
            {[
              { icon: '📏', label: 'Dimensionality', val: '224 x 224 x 3 (Standard)', color: 'text-emerald-600' },
              { icon: '📉', label: 'Normalization', val: 'Min-Max (1./255)', color: 'text-blue-600' },
              { icon: '🌪️', label: 'Adaptive Contrast', val: 'CLAHE Local Enhancement', color: 'text-purple-600' }
            ].map((spec, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">{spec.icon}</div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</p>
                  <p className={`text-lg font-black ${spec.color}`}>{spec.val}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dataset;
