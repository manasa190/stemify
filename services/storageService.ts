
import { HistoryItem, Specimen } from "../types";

export const Storage = {
  getRecords: (): HistoryItem[] => {
    try {
      const saved = localStorage.getItem('stemify_v2_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Corrupt history data reset.");
      return [];
    }
  },
  
  saveRecord: (record: HistoryItem) => {
    try {
      const history = Storage.getRecords();
      // Enforce limit to prevent quota exceeded errors
      const limitedHistory = [record, ...history].slice(0, 50); 
      localStorage.setItem('stemify_v2_history', JSON.stringify(limitedHistory));
    } catch (e) {
      console.error("Storage Quota Exceeded or Error:", e);
    }
  },

  getSpecimens: (): Specimen[] => {
    try {
      const saved = localStorage.getItem('stemify_specimens');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Corrupt specimen data reset.");
      return [];
    }
  },

  saveSpecimen: (specimen: Specimen) => {
    try {
      const specimens = Storage.getSpecimens();
      const index = specimens.findIndex(s => s.id === specimen.id);
      if (index >= 0) {
        specimens[index] = specimen;
      } else {
        specimens.push(specimen);
      }
      localStorage.setItem('stemify_specimens', JSON.stringify(specimens));
    } catch (e) {
      console.error("Storage Error saving specimen:", e);
    }
  }
};
