
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { History, Search } from 'lucide-react';
import { HistoryItem } from '../types';

const MOCK_TRAINING_DATA = [
  { epoch: 1, acc: 65, val_acc: 60 },
  { epoch: 2, acc: 72, val_acc: 68 },
  { epoch: 3, acc: 78, val_acc: 75 },
  { epoch: 4, acc: 85, val_acc: 81 },
  { epoch: 5, acc: 91, val_acc: 88 },
  { epoch: 6, acc: 94, val_acc: 92 },
  { epoch: 7, acc: 97, val_acc: 94 }
];

const CATEGORY_DIST = [
  { name: 'Healthy', value: 1200 },
  { name: 'Stem Rust', value: 850 },
  { name: 'Canker', value: 430 },
  { name: 'Fusarium', value: 560 },
  { name: 'Borer', value: 310 }
];

interface ResearchDashboardProps {
  history: HistoryItem[];
}

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({ history }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2.5rem] p-8">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6">Neural Convergence Curve</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TRAINING_DATA}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="epoch" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="acc" stroke="#10b981" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={3} />
                <Area type="monotone" dataKey="val_acc" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6">Categorical Distribution (Kaggle v2)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DIST}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {CATEGORY_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass rounded-[2.5rem] p-8">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            <History size={20} /> Recent Validations
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            {history.length > 0 ? (
              history.slice(0, 10).map(h => (
                <div key={h.id} className="flex items-center gap-4 p-3 hover:bg-white/40 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                  <img src={h.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{h.result.diseaseName}</p>
                    <p className="text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${h.result.severity === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {h.result.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Search className="mx-auto mb-2 opacity-20" size={32} />
                <p className="text-xs">No records found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8">
          <h3 className="text-xl font-extrabold text-slate-800 mb-4">Neural Processing Logs</h3>
          <div className="bg-slate-900 rounded-2xl p-6 font-mono text-xs text-emerald-400 h-[400px] overflow-y-auto space-y-1">
            <p>[09:22:10] SYSTEM: Initializing Vision Buffer...</p>
            <p>[09:22:11] CUDA: Memory detected 16GB. Warm-up phase initiated.</p>
            <p>[09:22:12] MODEL: MobileNetV2 backbone loaded. Parameters: 2.2M</p>
            <p>[09:22:15] DB: Synced to cluster0.qes99.mongodb.net (Institutional v2)</p>
            <p className="text-blue-400">[09:22:18] AUTH: Session validated. Access Level: SCIENTIST_II</p>
            <p>[09:22:20] IDLE: Awaiting telemetry packet...</p>
            <p className="text-slate-500 italic mt-4">-- End of live stream --</p>
          </div>
        </div>
      </div>
    </div>
  );
};
