
import React from 'react';
import { motion } from 'framer-motion';
import { VirtualPlant } from '../types';
import { Droplet, Sprout, Wind, Thermometer, ShieldCheck } from 'lucide-react';

const STAGE_VISUALS = {
  Seed: '🌱',
  Sprout: '🌿',
  Vegetative: '🌳',
  Bloom: '🌸',
  Harvest: '🍎'
};

interface CareConsoleProps {
  plants: VirtualPlant[];
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
}

export const CareConsole: React.FC<CareConsoleProps> = ({ plants, onWater, onFertilize }) => {
  // Fix: Cast motion.div to any to resolve property 'whileHover' and 'initial' type errors in specific environments.
  const MotionDiv = motion.div as any;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {plants.map((plant) => (
        <MotionDiv 
          key={plant.id}
          whileHover={{ y: -5 }}
          className="glass rounded-[2rem] p-6 flex items-center gap-6 group"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-5xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-200/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="z-10">{STAGE_VISUALS[plant.stage]}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-lg text-slate-800">{plant.name}</h4>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{plant.type} • {plant.stage}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-600">{plant.health}% Health</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1">
                  <MotionDiv 
                    initial={{ width: 0 }}
                    animate={{ width: `${plant.health}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => onWater(plant.id)}
                className="flex items-center justify-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl transition-all font-bold text-xs"
              >
                <Droplet size={14} /> WATER
              </button>
              <button 
                onClick={() => onFertilize(plant.id)}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-2xl transition-all font-bold text-xs"
              >
                <Sprout size={14} /> NUTRIENTS
              </button>
            </div>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
};
