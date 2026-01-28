
import React from 'react';
import { SeasonalMode } from '../types';

/**
 * Institutional Version: 
 * Particles have been replaced with a clean diagnostic background 
 * to adhere to research protocol constraints.
 */
export const SeasonalEngine: React.FC<{ 
  mode: SeasonalMode; 
  intensity: 'high' | 'medium' | 'low' | 'none';
  customParticles?: string[];
  direction?: 'up' | 'down';
}> = () => {
  return null; // Maintenance mode: Atmospheric particles disabled for institutional fidelity.
};
