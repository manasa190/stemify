
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT, COMPARATIVE_SYSTEM_PROMPT } from "../constants";
import { AnalysisResult, ComparativeAnalysisResult } from "../types";

/**
 * Helper to strip Markdown code blocks if the model includes them
 * despite the responseMimeType setting.
 */
const cleanJsonString = (text: string): string => {
  let clean = text.trim();
  // Remove markdown code blocks (```json ... ``` or just ``` ... ```)
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return clean;
};

export const analyzeStemImage = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash', // Switched to 2.0 Flash for better vision performance
    contents: {
      parts: [
        { text: SYSTEM_PROMPT },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image
          }
        }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          severity: { type: Type.STRING },
          explanation: { type: Type.STRING },
          pathologicalMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
          affectedRegionDescription: { type: Type.STRING },
          detailedRecommendations: {
            type: Type.OBJECT,
            properties: {
              cultural: { type: Type.ARRAY, items: { type: Type.STRING } },
              biological: { type: Type.ARRAY, items: { type: Type.STRING } },
              chemical: { type: Type.ARRAY, items: { type: Type.STRING } },
              immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
              prohibited: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['cultural', 'biological', 'chemical', 'immediate', 'prohibited']
          },
          preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
          treatmentGuidelines: { type: Type.STRING },
          riskSynthesis: { type: Type.STRING },
          environmentalThresholds: {
            type: Type.OBJECT,
            properties: {
              idealTemp: { type: Type.STRING },
              idealHumidity: { type: Type.STRING },
              riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['idealTemp', 'idealHumidity', 'riskFactors']
          }
        },
        required: [
          'diseaseName', 'scientificName', 'confidence', 'severity', 
          'explanation', 'pathologicalMarkers', 'affectedRegionDescription', 'detailedRecommendations', 
          'preventiveMeasures', 'treatmentGuidelines', 'environmentalThresholds', 'riskSynthesis'
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis result received from the expert engine.");
  
  try {
    return JSON.parse(cleanJsonString(text)) as AnalysisResult;
  } catch (e) {
    console.error("JSON Parse Error:", e, "Received text:", text);
    throw new Error("Failed to process diagnostic data. Please retake the image.");
  }
};

export const analyzeComparativeStems = async (imgA: string, imgB: string): Promise<ComparativeAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: {
      parts: [
        { text: COMPARATIVE_SYSTEM_PROMPT },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imgA.split(',')[1] || imgA
          }
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imgB.split(',')[1] || imgB
          }
        }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualDifferences: { type: Type.STRING },
          progressionComparison: { type: Type.STRING },
          higherRiskSubject: { type: Type.STRING },
          riskReasoning: { type: Type.STRING },
          impactOnGrowthAndYield: { type: Type.STRING },
          likelihoodOfSpread: { type: Type.STRING },
          subjectA_Diagnosis: { type: Type.STRING },
          subjectB_Diagnosis: { type: Type.STRING }
        },
        required: [
          'visualDifferences', 'progressionComparison', 'higherRiskSubject',
          'riskReasoning', 'impactOnGrowthAndYield', 'likelihoodOfSpread',
          'subjectA_Diagnosis', 'subjectB_Diagnosis'
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Comparative analysis failed.");
  
  try {
    return JSON.parse(cleanJsonString(text)) as ComparativeAnalysisResult;
  } catch (e) {
    console.error("JSON Parse Error:", e, "Received text:", text);
    throw new Error("Failed to compare specimens.");
  }
};
