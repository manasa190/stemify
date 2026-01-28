
export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type InferenceMode = 'STANDARD' | 'NEURAL';

export interface DetailedRecommendation {
  cultural: string[];
  biological: string[];
  chemical: string[];
  immediate: string[];
  prohibited: string[];
}

export interface CnnProbability {
  label: string;
  score: number;
}

export interface CnnInference {
  predictedClass: string;
  confidence: number;
  top3: CnnProbability[];
  status: 'success' | 'uncertain' | 'rejected';
  rejectionReason?: string;
  architecture: string;
}

export interface RuleBasedInference {
  dominantHue: string;
  lesionDensity: number; // 0-1
  contrastRatio: number;
  detectedAnomalies: string[];
  reliability: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  mode: InferenceMode;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: SeverityLevel;
  explanation: string;
  pathologicalMarkers: string[];
  affectedRegionDescription: string;
  detailedRecommendations: DetailedRecommendation;
  preventiveMeasures: string[];
  treatmentGuidelines: string;
  riskSynthesis: string; 
  environmentalThresholds: {
    idealTemp: string;
    idealHumidity: string;
    riskFactors: string[];
  };
  cnnLayerInsights?: CnnInference; 
  ruleBasedInsights?: RuleBasedInference;
  fallbackUsed: boolean;
}

export interface ComparativeAnalysisResult {
  visualDifferences: string;
  progressionComparison: string;
  higherRiskSubject: 'Subject A' | 'Subject B' | 'Equal';
  riskReasoning: string;
  impactOnGrowthAndYield: string;
  likelihoodOfSpread: string;
  subjectA_Diagnosis: string;
  subjectB_Diagnosis: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  result: AnalysisResult;
  syncStatus?: 'pending' | 'synced' | 'failed';
  specimenId?: string; 
}

export interface Specimen {
  id: string;
  name: string;
  variety: string;
  location: string;
  createdAt: number;
  healthHistory: {
    timestamp: number;
    score: number; 
    historyId: string;
  }[];
}

export type DetectionRecord = HistoryItem;

export interface IoTData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lastUpdated: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type SeasonalMode = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Custom';

export interface AppSettings {
  branding: {
    orgName: string;
    contact: { website: string };
    footerText: string;
    primaryColor: string;
    secondaryColor: string;
  };
  appearance: {
    theme: 'modern' | 'glass' | 'high-contrast' | 'matrix' | 'retro-crt' | 'cyberpunk';
    season: SeasonalMode;
    activeParticles: string[]; 
    visualFilter: 'none' | 'grayscale' | 'sepia' | 'vibrant' | 'night-vision';
    particleDirection: 'down' | 'up';
  };
  accessibility: {
    animationIntensity: 'high' | 'medium' | 'low' | 'none';
    neuralGlow: boolean;
    highPrecisionCursors: boolean;
    activeInferenceMode: InferenceMode;
  };
}

export interface VirtualPlant {
  id: string;
  name: string;
  type: string;
  health: number;
  stage: 'Seed' | 'Sprout' | 'Vegetative' | 'Bloom' | 'Harvest';
}
