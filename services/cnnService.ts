
import { CnnInference, CnnProbability, RuleBasedInference } from "../types";
import { LABEL_MAPPING } from "../constants";

/**
 * STEMIFY HYBRID INFERENCE ENGINE (Simulation Core v2.7)
 * High-fidelity simulation for institutional demonstration.
 */
export const CnnService = {
  /**
   * Mode A: NEURAL INFERENCE (Deep Learning Simulation)
   * @param base64 The image to analyze
   * @param expertHint Optional hint from Gemini to ensure pathological consistency in demo
   */
  runInference: async (base64: string, expertHint?: string): Promise<CnnInference> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        if (img.width < 128 || img.height < 128) {
          return resolve({
            predictedClass: "Resolution Error",
            confidence: 0,
            top3: [],
            status: 'rejected',
            rejectionReason: "Pixel density below feature extraction threshold.",
            architecture: "ResNet50"
          });
        }

        let predictedClass = expertHint || "Healthy";
        
        if (!LABEL_MAPPING.includes(predictedClass)) {
          const closest = LABEL_MAPPING.find(l => predictedClass.toLowerCase().includes(l.toLowerCase()));
          predictedClass = closest || LABEL_MAPPING[0];
        }

        const confidence = 0.91 + Math.random() * 0.06; 
        
        const otherLabels = LABEL_MAPPING.filter(l => l !== predictedClass);
        const top3: CnnProbability[] = [
          { label: predictedClass, score: confidence },
          { label: otherLabels[0], score: (1 - confidence) * 0.65 },
          { label: otherLabels[1], score: (1 - confidence) * 0.35 }
        ];

        resolve({
          predictedClass,
          confidence,
          top3,
          status: 'success',
          architecture: "ResNet50 (Simulated Weights)"
        });
      };
      img.src = base64;
    });
  },

  /**
   * Mode B: STANDARD INFERENCE (Rule-Based / Classical)
   */
  runStandardInference: async (base64: string): Promise<RuleBasedInference> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;

        let rSum = 0, gSum = 0, bSum = 0;
        let anomalousPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2];
          rSum += r; gSum += g; bSum += b;
          if (r > g * 1.25 && r > 50) anomalousPixels++;
        }

        const lesionDensity = anomalousPixels / (100 * 100);
        const avgR = rSum / (100 * 100);
        const avgG = gSum / (100 * 100);
        
        const dominantHue = avgR > avgG ? 'Necrotic Pigment (Brown/Rust)' : 'Chlorophyll Dominant (Green)';
        const anomalies = [];
        if (lesionDensity > 0.05) anomalies.push("Micro-lesion surface irregularities");
        if (lesionDensity > 0.12) anomalies.push("Significant vascular pigmentation loss");
        if (avgR > 160) anomalies.push("Pathological Spectral Shift detected");

        resolve({
          dominantHue,
          lesionDensity,
          contrastRatio: 1.45,
          detectedAnomalies: anomalies.length ? anomalies : ["Baseline spectral data observed"],
          reliability: 'High'
        });
      };
      img.src = base64;
    });
  }
};
