
import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionInput, PredictionOutput } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    predictedYield: {
      type: Type.NUMBER,
      description: "The predicted crop yield in tonnes per hectare.",
    },
    unit: {
      type: Type.STRING,
      description: "The unit of measurement for the yield, e.g., 'tonnes/hectare'.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A confidence score for the prediction, from 0.0 to 1.0. Higher is more confident.",
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A short, actionable title for the recommendation.",
          },
          description: {
            type: Type.STRING,
            description: "A detailed explanation of the recommendation and its potential impact.",
          },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["predictedYield", "unit", "confidenceScore", "recommendations"],
};

export const predictCropYield = async (
  input: PredictionInput
): Promise<PredictionOutput> => {
  const prompt = `
    Act as an advanced agricultural AI expert system. Your purpose is to predict crop yields with high accuracy based on provided data.
    Analyze the following agricultural parameters and provide a crop yield prediction. Also, offer actionable recommendations to improve the yield.

    Input Data:
    - Crop Type: ${input.crop}
    - Land Area: ${input.area} hectares
    - Soil Type: ${input.soilType}
    - Annual Rainfall: ${input.annualRainfall} mm
    - Average Temperature: ${input.avgTemperature}°C
    - Nitrogen Level (N): ${input.nitrogen} kg/ha
    - Phosphorus Level (P): ${input.phosphorus} kg/ha
    - Potassium Level (K): ${input.potassium} kg/ha

    You MUST respond ONLY with a valid JSON object that conforms to the provided schema. Do not include any text, explanation, or markdown formatting before or after the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
      },
    });

    const jsonText = response.text.trim();
    const predictionData = JSON.parse(jsonText);

    // Basic validation to ensure the parsed data matches the expected structure
    if (
      typeof predictionData.predictedYield !== 'number' ||
      typeof predictionData.unit !== 'string' ||
      typeof predictionData.confidenceScore !== 'number' ||
      !Array.isArray(predictionData.recommendations)
    ) {
      throw new Error("Invalid data structure received from API.");
    }
    
    return predictionData as PredictionOutput;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      "Failed to get prediction from the AI model. Please check the input values and try again."
    );
  }
};
