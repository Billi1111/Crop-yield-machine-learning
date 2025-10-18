
export interface PredictionInput {
  crop: string;
  area: number;
  soilType: string;
  annualRainfall: number;
  avgTemperature: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface Recommendation {
  title: string;
  description: string;
}

export interface PredictionOutput {
  predictedYield: number;
  unit: string;
  confidenceScore: number;
  recommendations: Recommendation[];
}
