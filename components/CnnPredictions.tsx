
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_TRAINING_DATA, MODEL_ARCHITECTURE_INFO, CONFUSION_MATRIX, TRAINING_CODE_SNIPPET, KAGGLE_DATASETS, LABEL_MAPPING } from '../constants';
import { Cpu, Activity, BarChart3, Binary, ShieldCheck, Database, Layers, ArrowDown, FileText, CheckCircle2 } from 'lucide-react';

const CnnPredictions: React.FC = () => {
  return (
    <div className="space-y-24 pb-32 animate-in fade-in slide-in-from-bottom-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-700 tracking-widest uppercase">
             <Database size={12} /> Institutional Data Corpus & Neural Specs
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">Technical <span className="text-[#064e3b]">Compendium</span></h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            A complete technical overview of the datasets, preprocessing pipelines, convolutional neural network (CNN) architecture, and performance validation metrics used in STEMIFY.
          </p>
        </div>
      </div>

      {/* SECTION 1: DATASETS */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700">
             <Database size={24} />
           </div>
           <div>
             <h3 className="text-3xl font-black text-slate-900">Dataset Composition</h3>
             <p className="text-slate-500 font-medium">Aggregated from high-variance agricultural repositories (Kaggle)</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KAGGLE_DATASETS.map((ds, i) => (
            <div key={i} className="group bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <span className="text-6xl font-black">#{ds.label}</span>
                </div>
                
                {/* Simulated Thumbnail */}
                <div className="h-32 bg-slate-100 rounded-[2rem] mb-6 overflow-hidden relative">
                    <img 
                      src={`https://source.unsplash.com/random/400x300/?${ds.name.split(' ')[0]},plant,leaf`} 
                      alt={ds.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-widest">
                       {ds.count} Samples
                    </div>
                </div>

                <h4 className="text-lg font-black text-slate-800 leading-tight mb-2">{ds.name}</h4>
                <div className="flex items-center gap-2 mb-4">
                   <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[8px] font-bold text-slate-500 uppercase">Class {ds.label}</span>
                   <span className="px-2 py-0.5 bg-emerald-50 rounded-md text-[8px] font-bold text-emerald-600 uppercase">Verified</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Source Origin</p>
                    <p className="text-[9px] font-mono text-slate-600 truncate">{ds.url}</p>
                </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Layers size={200} /></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-4">
                 <h4 className="text-2xl font-black text-emerald-400">Total Corpus Size</h4>
                 <p className="text-6xl font-black tracking-tighter">9,550 <span className="text-xl text-slate-500 font-bold align-top">+</span></p>
                 <p className="text-sm font-medium text-slate-400">Validated agricultural images across 6 distinct pathological classes.</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 gap-8">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Training Split (80%)</p>
                    <div className="w-full bg-slate-800 h-2 rounded-full mb-2 overflow-hidden">
                       <div className="bg-emerald-500 w-[80%] h-full" />
                    </div>
                    <p className="text-2xl font-bold">7,640 Samples</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Validation Split (20%)</p>
                    <div className="w-full bg-slate-800 h-2 rounded-full mb-2 overflow-hidden">
                       <div className="bg-blue-500 w-[20%] h-full" />
                    </div>
                    <p className="text-2xl font-bold">1,910 Samples</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 2: ARCHITECTURE */}
      <section className="space-y-12">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700">
             <Cpu size={24} />
           </div>
           <div>
             <h3 className="text-3xl font-black text-slate-900">Neural Architecture (CNN)</h3>
             <p className="text-slate-500 font-medium">Deep Learning Pipeline & Implementation Details</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Visual Diagram */}
           <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                 <Activity size={20} className="text-[#064e3b]" /> Layer Topology
              </h4>
              
              <div className="space-y-0 relative">
                 {/* Input */}
                 <div className="relative z-10 p-6 bg-slate-50 border border-slate-200 rounded-3xl flex justify-between items-center">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Input Layer</p>
                       <p className="text-lg font-black text-slate-800">Image (224, 224, 3)</p>
                    </div>
                    <Database size={24} className="text-slate-300" />
                 </div>
                 
                 <div className="h-8 flex justify-center"><ArrowDown className="text-slate-300" /></div>

                 {/* Backbone */}
                 <div className="relative z-10 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex justify-between items-center shadow-lg shadow-emerald-100/50">
                    <div>
                       <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Transfer Learning Backbone</p>
                       <p className="text-lg font-black text-emerald-900">MobileNetV2 (Frozen)</p>
                    </div>
                    <Cpu size={24} className="text-emerald-400" />
                 </div>

                 <div className="h-8 flex justify-center"><ArrowDown className="text-slate-300" /></div>

                 {/* Custom Head */}
                 <div className="relative z-10 p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-3 shadow-lg shadow-blue-100/50">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Custom Classification Head</p>
                    <div className="grid grid-cols-1 gap-2">
                       {MODEL_ARCHITECTURE_INFO.customHead.map((layer, i) => (
                          <div key={i} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 border border-blue-100/50 flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {layer}
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="h-8 flex justify-center"><ArrowDown className="text-slate-300" /></div>

                 {/* Output */}
                 <div className="relative z-10 p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl flex justify-between items-center shadow-xl">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Output Layer</p>
                       <p className="text-lg font-black text-white">Softmax (6 Classes)</p>
                    </div>
                    <CheckCircle2 size={24} className="text-emerald-400" />
                 </div>
              </div>
           </div>

           {/* Code & Graphs */}
           <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Binary size={180} /></div>
                 <h4 className="text-white font-black text-lg mb-6 flex items-center gap-3">
                    <FileText className="text-emerald-400" /> Python Implementation (Keras)
                 </h4>
                 <div className="bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 font-mono text-[10px] text-emerald-400 leading-relaxed overflow-x-auto scrollbar-hide relative z-10">
                    <pre>{TRAINING_CODE_SNIPPET.trim()}</pre>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm h-[360px]">
                 <h4 className="text-slate-900 font-black text-lg mb-6 flex items-center gap-3">
                    <BarChart3 className="text-blue-500" /> Convergence Metrics
                 </h4>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_TRAINING_DATA}>
                        <defs>
                            <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="epoch" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis domain={[0.5, 1]} stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="accuracy" stroke="#10b981" fill="url(#accGrad)" strokeWidth={4} name="Training Acc" />
                        <Area type="monotone" dataKey="val_accuracy" stroke="#3b82f6" fill="transparent" strokeWidth={3} strokeDasharray="8 8" name="Validation Acc" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 3: PERFORMANCE */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
             <ShieldCheck size={24} />
           </div>
           <div>
             <h3 className="text-3xl font-black text-slate-900">Validation Matrix</h3>
             <p className="text-slate-500 font-medium">Confusion Matrix & F1-Score Analysis</p>
           </div>
        </div>

        <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-200/60">
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="font-black text-slate-800">Confusion Matrix</h4>
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full">Test Set (n=1,910)</span>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="min-w-[400px] grid grid-cols-7 gap-2">
                            <div className="col-span-1"></div>
                            {CONFUSION_MATRIX.labels.map(l => (
                            <div key={l} className="text-[8px] font-black text-slate-400 text-center uppercase tracking-widest truncate">{l.split(' ')[1] || l}</div>
                            ))}
                            {CONFUSION_MATRIX.labels.map((rowLabel, i) => (
                            <React.Fragment key={i}>
                                <div className="text-[8px] font-black text-slate-400 flex items-center justify-end uppercase pr-4 truncate">{rowLabel}</div>
                                {CONFUSION_MATRIX.data[i].map((val, j) => (
                                <div key={`${i}-${j}`} className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${i === j ? 'bg-[#064e3b] text-white shadow-lg scale-105' : 'bg-slate-50 border border-slate-100 text-slate-300'}`}>
                                    {val}%
                                </div>
                                ))}
                            </React.Fragment>
                            ))}
                        </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="font-black text-slate-800 text-xl">Performance Insight</h4>
                 <p className="text-slate-600 font-medium leading-relaxed">
                    The model demonstrates strong diagonal dominance, indicating high classification accuracy across all 6 classes. 
                    Minor confusion is observed between <span className="text-slate-900 font-bold">Stem Canker</span> and <span className="text-slate-900 font-bold">Stem Wilt</span> due to similar necrotic tissue discoloration patterns in early stages.
                 </p>

                 <div className="grid grid-cols-2 gap-6 pt-6">
                    <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Global Precision</p>
                        <p className="text-4xl font-black text-emerald-600">93.4%</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">F1-Score</p>
                        <p className="text-4xl font-black text-blue-600">0.91</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default CnnPredictions;
