
import React from 'react';
import { IoTData } from '../types';

const IoTStats: React.FC<{ data: IoTData }> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-y-6">
      <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ambient Thermal</p>
        <p className="text-2xl font-black text-slate-900">{data.temperature}°C <span className="emoji-glyph">🌡️</span></p>
      </div>
      <div className="space-y-1 text-right">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Air Saturation</p>
        <p className="text-2xl font-black text-slate-900">{data.humidity}% <span className="emoji-glyph">💧</span></p>
      </div>
      <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Soil Volumetric</p>
        <p className="text-2xl font-black text-slate-900">{data.soilMoisture}% <span className="emoji-glyph">🌱</span></p>
      </div>
      <div className="space-y-1 text-right flex flex-col justify-end">
        <p className="text-[7px] font-bold text-slate-300 uppercase italic tracking-widest">ID: NODE_04_S2</p>
      </div>
    </div>
  );
};

export default IoTStats;
