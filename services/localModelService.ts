import type { PredictionInput, PredictionOutput } from '../types';

const LOCAL_API_URL = 'http://127.0.0.1:5000/predict';

// The input format already matches what we need for JSON serialization.
// We just need to ensure the property names match what the Python server expects.
const formatInputForPython = (input: PredictionInput) => {
  return {
    crop: input.crop,
    soilType: input.soilType,
    annualRainfall: input.annualRainfall,
    avgTemperature: input.avgTemperature,
    nitrogen: input.nitrogen,
    phosphorus: input.phosphorus,
    potassium: input.potassium,
    // The 'area' field is not used by our simple Python model, so it's not sent.
  };
}

export const predictWithLocalModel = async (
  input: PredictionInput
): Promise<PredictionOutput> => {
  try {
    const formattedInput = formatInputForPython(input);

    const response = await fetch(LOCAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedInput),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from local server.' }));
        throw new Error(`Local model server error: ${response.statusText} - ${errorData.error || 'Unknown error'}`);
    }

    const predictionData: PredictionOutput = await response.json();

    // Basic validation to ensure the response is in the expected format
    if (typeof predictionData.predictedYield !== 'number') {
        throw new Error("Invalid data structure received from local model server.");
    }

    return predictionData;

  } catch (error) {
    console.error("Error calling local model API:", error);
    if (error instanceof TypeError) { // This often indicates a network error (e.g., server not running, CORS issue)
        throw new Error(
            "Could not connect to the local Python model server. Please ensure it is running on http://127.0.0.1:5000 and that CORS is enabled."
        );
    }
    // Re-throw other errors to be caught by the main handler
    throw error;
  }
};
