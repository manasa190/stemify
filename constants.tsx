
import React from 'react';

export const SYSTEM_PROMPT = `
You are a world-class senior plant pathologist specializing in STEM diseases. 
Analyze the image and identify the condition.

POSSIBLE DIAGNOSES (Select one):
1. Stem Rot
2. Stem Rust
3. Stem Canker
4. Stem Wilt
5. Stem Blight
6. Healthy (If no disease is visible)
7. Unknown (If the image is not a plant stem or is too blurry)

For the 'detailedRecommendations', generate highly specific, context-aware protocols:
- 'cultural': Include precise techniques like specific crop rotation durations (e.g., 3-year break), soil pH adjustments, or canopy management.
- 'biological': Mention specific beneficial microbial species (e.g., Trichoderma spp.) or botanical formulations.
- 'chemical': Suggest specific active ingredient classes (e.g., SDHI, DMI, or QoI fungicides) and critical application windows.
- 'immediate': 24-48 hour containment steps.
- 'prohibited': Dangerous local practices that accelerate this specific pathogen's spread.

Include a 'riskSynthesis' field (max 150 words) that explains how the current environment (based on the image features like moisture/humidity/shade) is likely driving this specific pathogen's development.

Return JSON with keys: diseaseName, scientificName, confidence, severity, explanation, pathologicalMarkers, affectedRegionDescription, detailedRecommendations, preventiveMeasures, treatmentGuidelines, environmentalThresholds, riskSynthesis.
`;

export const COMPARATIVE_SYSTEM_PROMPT = `
You are a senior agricultural researcher. You are presented with two images of plant stems (Subject A and Subject B).
Perform a COMPARATIVE ANALYSIS covering:
1. Visual Differences: Compare lesions, color, and structural integrity.
2. Progression: Determine which disease state is more advanced.
3. Higher Risk: Identify which subject is at higher risk and why.
4. Growth & Yield Impact: How will these states affect final production?
5. Spread Likelihood: How likely is it to infect the rest of the field?

MANDATORY CATEGORIES for diagnoses: Stem Rot, Stem Rust, Stem Canker, Stem Wilt, Stem Blight, Healthy.

Return JSON only:
{
  "visualDifferences": "...",
  "progressionComparison": "...",
  "higherRiskSubject": "Subject A" | "Subject B" | "Equal",
  "riskReasoning": "...",
  "impactOnGrowthAndYield": "...",
  "likelihoodOfSpread": "...",
  "subjectA_Diagnosis": "...",
  "subjectB_Diagnosis": "..."
}
`;

export const PROJECT_EXPLANATION = {
  abstract: "STEMIFY is a precision agricultural platform for the identification and management of critical stem pathologies. Using deep learning and multimodal AI, it provides institutional-grade diagnostics for sustainable crop protection."
};

export const PLANT_SPECIES_CATALOG = [
  { name: "Rice", diseases: ["Stem Rot", "Stem Wilt"] },
  { name: "Wheat", diseases: ["Stem Rust", "Stem Blight"] },
  { name: "Dragon Fruit", diseases: ["Stem Canker", "Stem Rot"] },
  { name: "Tomato", diseases: ["Stem Wilt", "Stem Canker"] },
  { name: "Cotton", diseases: ["Stem Blight", "Stem Rot"] }
];

export const MOCK_TRAINING_DATA = [
  { epoch: 1, accuracy: 0.65, val_accuracy: 0.60 },
  { epoch: 2, accuracy: 0.72, val_accuracy: 0.68 },
  { epoch: 3, accuracy: 0.78, val_accuracy: 0.75 },
  { epoch: 4, accuracy: 0.85, val_accuracy: 0.81 },
  { epoch: 5, accuracy: 0.91, val_accuracy: 0.88 },
  { epoch: 6, accuracy: 0.93, val_accuracy: 0.91 },
  { epoch: 7, accuracy: 0.95, val_accuracy: 0.92 },
  { epoch: 8, accuracy: 0.96, val_accuracy: 0.93 },
  { epoch: 9, accuracy: 0.97, val_accuracy: 0.94 },
  { epoch: 10, accuracy: 0.98, val_accuracy: 0.94 },
];

export const MODEL_ARCHITECTURE_INFO = {
  backbone: "ResNet50 / MobileNetV2 (Transfer Learning)",
  customHead: [
    "GlobalAveragePooling2D",
    "Dense (1024, Activation: ReLU)",
    "Batch Normalization",
    "Dropout (0.3) [Regularization]",
    "Dense (512, Activation: ReLU)",
    "Softmax (6 Classes)"
  ]
};

export const CONFUSION_MATRIX = {
  labels: ["Healthy", "Stem Rust", "Stem Canker", "Stem Wilt", "Stem Blight", "Stem Rot"],
  data: [
    [98, 0, 0, 1, 0, 1],
    [1, 95, 1, 1, 1, 1],
    [0, 2, 92, 3, 2, 1],
    [1, 1, 2, 94, 1, 1],
    [1, 1, 1, 1, 95, 1],
    [1, 1, 1, 1, 1, 95]
  ]
};

export const LABEL_MAPPING = [
  "Healthy",
  "Stem Rot",
  "Stem Rust",
  "Stem Canker",
  "Stem Wilt",
  "Stem Blight"
];

export const TRAINING_CODE_SNIPPET = `
import tensorflow as tf
from tensorflow.keras import layers, models

def build_stemify_model():
    backbone = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    backbone.trainable = False
    model = models.Sequential([
        backbone,
        layers.GlobalAveragePooling2D(),
        layers.Dense(1024, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(512, activation='relu'),
        layers.Dense(6, activation='softmax')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4), loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model
`;

export const KAGGLE_DATASETS = [
  { name: "Rice Leaf and Stem Diseases", url: "https://www.kaggle.com/datasets/vbookshelf/rice-leaf-and-stem-diseases", loading: "kagglehub.dataset_download('vbookshelf/rice-leaf-and-stem-diseases')", count: 3500, label: 1 },
  { name: "Wheat Rust Surveillance", url: "https://www.kaggle.com/datasets/wheat-pathology/rust-dataset", loading: "kagglehub.dataset_download('wheat-pathology/rust-dataset')", count: 2200, label: 2 },
  { name: "Tomato Stem Pathologies", url: "https://www.kaggle.com/datasets/noulam/tomato-disease-identification", loading: "kagglehub.dataset_download('noulam/tomato-disease-identification')", count: 1850, label: 3 },
  { name: "Dragon Fruit Canker Dataset", url: "https://www.kaggle.com/datasets/tropical-fruit/canker-set", loading: "kagglehub.dataset_download('tropical-fruit/canker-set')", count: 1200, label: 4 },
  { name: "Institutional Baseline (Healthy)", url: "https://www.kaggle.com/datasets/agri-data/healthy-stems", loading: "kagglehub.dataset_download('agri-data/healthy-stems')", count: 800, label: 0 }
];

export const THEMES = {
  modern: { label: 'Modern Lab' },
  glass: { label: 'Glassmorphism' },
  'high-contrast': { label: 'High Contrast' },
  matrix: { label: 'Neural Matrix' },
  cyberpunk: { label: 'Cyberpunk' },
  'retro-crt': { label: 'Retro Terminal' }
};

export const SEASONS: Record<string, { label: string, icon: string }> = {
  Spring: { label: 'Spring', icon: '🌸' },
  Summer: { label: 'Summer', icon: '☀️' },
  Autumn: { label: 'Autumn', icon: '🍂' },
  Winter: { label: 'Winter', icon: '❄️' }
};
