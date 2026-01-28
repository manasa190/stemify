
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Specimen, HistoryItem, SeverityLevel } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Calendar, MapPin, Activity, ChevronRight, History as HistoryIcon, 
  TrendingUp, ArrowLeft, Layers, Image as ImageIcon, AlertTriangle,
  TrendingDown, Clock, ShieldAlert, CheckCircle, Zap, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface SpecimenMonitorProps {
  specimens: Specimen[];
  history: HistoryItem[];
}

export const SpecimenMonitor: React.FC<SpecimenMonitorProps> = ({ specimens, history }) => {
  const MotionButton = motion.button as any;
  const MotionDiv = motion.div as any;
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string | null>(null);

  const selectedSpecimen = specimens.find(s => s.id === selectedSpecimenId);
  
  const specimenHistory = useMemo(() => {
    return history
      .filter(h => h.specimenId === selectedSpecimenId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [history, selectedSpecimenId]);

  const chartData = useMemo(() => {
    return specimenHistory.map(h => {
      const baseHealth = h.result.severity === SeverityLevel.LOW ? 85 : h.result.severity === SeverityLevel.MEDIUM ? 45 : 15;
      return {
        date: new Date(h.timestamp).toLocaleDateString(),
        health: baseHealth,
        severity: h.result.severity === SeverityLevel.HIGH ? 100 : h.result.severity === SeverityLevel.MEDIUM ? 50 : 20,
        confidence: h.result.confidence * 100,
        timestamp: h.timestamp,
        disease: h.result.diseaseName
      };
    });
  }, [specimenHistory]);

  const riskTrend = useMemo(() => {
    if (chartData.length < 2) return { direction: 'stable', label: 'Baseline established' };
    const first = chartData[0].severity;
    const last = chartData[chartData.length - 1].severity;
    if (last > first + 10) return { direction: 'up', label: 'Escalating Risk Profile', color: 'text-rose-500' };
    if (last < first - 10) return { direction: 'down', label: 'Recovery in Progress', color: 'text-emerald-500' };
    return { direction: 'stable', label: 'Controlled Progression', color: 'text-amber-500' };
  }, [chartData]);

  const getLatestHealthData = (s: Specimen) => {
    if (s.healthHistory.length === 0) return { score: 100, status: 'Healthy / Baseline' };
    const latest = s.healthHistory[s.healthHistory.length - 1];
    
    let status = 'Stable';
    if (latest.score < 20) status = 'Terminal Necrosis';
    else if (latest.score < 40) status = 'Severe Infiltration';
    else if (latest.score < 70) status = 'Pathogen Detected';
    else if (latest.score < 90) status = 'Minor Lesions';

    return { score: latest.score, status };
  };

  if (selectedSpecimenId && selectedSpecimen) {
    const { score, status } = getLatestHealthData(selectedSpecimen);
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <button 
          onClick={() => setSelectedSpecimenId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors"
        >
          <ArrowLeft size={18} /> BACK TO INVENTORY
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Metadata & Trend */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={120} /></div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedSpecimen.name}</h2>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mb-6">{selectedSpecimen.variety}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <MapPin size={16} className="text-slate-400" /> {selectedSpecimen.location}
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <Clock size={16} className="text-slate-400" /> Tracking Day {Math.floor((Date.now() - selectedSpecimen.createdAt) / (1000 * 60 * 60 * 24)) + 1}
                </div>
                
                <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Live Risk Projection</p>
                  <div className="flex items-center gap-3">
                    {riskTrend.direction === 'up' && <ArrowUpRight className="text-rose-500" size={24} />}
                    {riskTrend.direction === 'down' && <ArrowDownRight className="text-emerald-500" size={24} />}
                    {riskTrend.direction === 'stable' && <Activity className="text-amber-500" size={24} />}
                    <span className={`text-sm font-black uppercase ${riskTrend.color}`}>{riskTrend.label}</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PATHOLOGICAL INDEX</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-end gap-3">
                      <span className={`text-6xl font-black ${score > 70 ? 'text-emerald-600' : score > 30 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {score}%
                      </span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight text-center border ${
                      score > 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      score > 30 ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <HistoryIcon size={16} className="text-emerald-400" /> Digital Archive
               </h3>
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                 {specimenHistory.map((h, i) => (
                   <div key={h.id} className="group relative pl-6 border-l border-slate-800 pb-6 last:pb-0">
                     <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full ${h.result.severity === SeverityLevel.HIGH ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                     <p className="text-[10px] font-black text-slate-500 uppercase">{new Date(h.timestamp).toLocaleDateString()}</p>
                     <p className="font-bold text-slate-200 text-sm mt-1">{h.result.diseaseName}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TIMELINE & JOURNEY */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                 <Zap size={24} className="text-amber-500" /> Pathological Journey Visualization
              </h3>
              
              <div className="h-64 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="severityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="severity" 
                      stroke="#f43f5e" 
                      fill="url(#severityGrad)" 
                      strokeWidth={4} 
                      name="Severity Level"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Day Milestone Stepper */}
              <div className="mt-12">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Severity Progression Timeline (Agricultural Critical Path)</p>
                <div className="relative flex justify-between items-center px-4 max-w-lg mx-auto">
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0" />
                  
                  {[1, 7, 14].map((day, idx) => {
                    const matchedPoint = specimenHistory.find(h => {
                       const diffDays = Math.floor((h.timestamp - selectedSpecimen.createdAt) / (1000 * 60 * 60 * 24));
                       return Math.abs(diffDays - (day-1)) <= 1;
                    });
                    
                    const isPassed = Math.floor((Date.now() - selectedSpecimen.createdAt) / (1000 * 60 * 60 * 24)) >= (day - 1);

                    return (
                      <div key={day} className="relative z-10 flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-4 ${
                          matchedPoint 
                          ? matchedPoint.result.severity === SeverityLevel.HIGH ? 'bg-rose-500 border-rose-100 text-white' : 'bg-emerald-500 border-emerald-100 text-white'
                          : isPassed ? 'bg-slate-200 border-white text-slate-400' : 'bg-white border-slate-100 text-slate-300'
                        }`}>
                          {matchedPoint ? <CheckCircle size={18} /> : <span className="text-[10px] font-black">{day}</span>}
                        </div>
                        <p className="text-[10px] font-black text-slate-600 mt-2 uppercase">Day {day}</p>
                        {matchedPoint && (
                          <div className="absolute top-16 bg-white p-3 rounded-2xl shadow-xl border border-slate-50 w-32 text-center z-20 scale-90">
                             <p className="text-[9px] font-black text-slate-800 uppercase leading-tight">{matchedPoint.result.diseaseName}</p>
                             <p className="text-[8px] font-bold text-slate-400 mt-1">Severity: {matchedPoint.result.severity.toUpperCase()}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
               <h4 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-6">
                 <Layers size={20} className="text-blue-500" /> Field Decision Matrix
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Diagnostic Observation</h5>
                    <p className="text-sm font-bold text-slate-700">
                      {riskTrend.direction === 'up' 
                        ? "Pathogen is spreading rapidly across vascular bundles. Immediate fungicidal intervention is advised to save the lower stalk."
                        : "Lesions appear to be drying/corking over. Systemic resistance is likely suppressing pathogen expansion."}
                    </p>
                  </div>
                  <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                    <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Recommended Strategy</h5>
                    <p className="text-sm font-bold text-slate-700">
                      {riskTrend.direction === 'up'
                        ? "Apply DMI/SDHI fungicide mix. Suspend overhead irrigation to lower micro-canopy humidity."
                        : "Continue monitoring every 48 hours. Maintain nutrient levels to bolster structural cellulose."}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-800">Digital Twins</h2>
          <p className="text-slate-500 font-medium">Monitoring the morphological evolution and recovery trajectories of agricultural subjects.</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] shadow-md border border-slate-100">
           <span className="text-2xl font-black text-emerald-600">{specimens.length}</span>
           <span className="text-[9px] font-black uppercase text-slate-400 ml-3">Active Monitors</span>
        </div>
      </div>

      {specimens.length === 0 ? (
        <div className="bg-white rounded-[3.5rem] p-20 text-center border-2 border-dashed border-slate-200">
           <Activity size={64} className="mx-auto text-slate-200 mb-6" />
           <h3 className="text-2xl font-black text-slate-800 mb-2">Inventory Empty</h3>
           <p className="text-slate-400 font-medium max-w-md mx-auto">
             Initialize your first specimen monitor via the Scan Lab to track biological recovery.
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specimens.map(s => {
            const { score, status } = getLatestHealthData(s);
            return (
              <MotionButton
                whileHover={{ y: -8, scale: 1.01 }}
                key={s.id}
                onClick={() => setSelectedSpecimenId(s.id)}
                className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 text-left group transition-all hover:border-emerald-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    score > 70 ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 
                    score > 30 ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : 
                    'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
                  }`}>
                    <Activity size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Health Index</p>
                    <p className={`text-2xl font-black ${
                      score > 70 ? 'text-emerald-600' : 
                      score > 30 ? 'text-amber-600' : 
                      'text-rose-600'
                    }`}>
                      {score}%
                    </p>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-800">{s.name}</h3>
                <p className="text-xs font-bold text-slate-400 mb-1">{s.variety}</p>
                <p className={`text-[10px] font-black uppercase tracking-tight mb-6 ${
                  score > 70 ? 'text-emerald-500' : 
                  score > 30 ? 'text-amber-500' : 
                  'text-rose-500'
                }`}>{status}</p>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 pt-6 border-t border-slate-50">
                  <Clock size={12} /> Day {Math.floor((Date.now() - s.createdAt) / (1000 * 60 * 60 * 24)) + 1}
                  <ChevronRight size={14} className="ml-auto text-emerald-500" />
                </div>
              </MotionButton>
            );
          })}
        </div>
      )}
    </div>
  );
};
