import React, { useState } from 'react';
import type { PredictionInput, PredictionOutput } from './types';
import { predictCropYield } from './services/geminiService';
import { predictWithLocalModel } from './services/localModelService';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Header from './components/Header';
import Footer from './components/Footer';
import ModelSelector from './components/ModelSelector';

type ModelType = 'gemini' | 'local';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelType, setModelType] = useState<ModelType>('gemini');

  const handlePrediction = async (input: PredictionInput) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = modelType === 'gemini'
        ? await predictCropYield(input)
        : await predictWithLocalModel(input);
      setPrediction(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (newModel: ModelType) => {
    setModelType(newModel);
    // Reset state when model changes
    setPrediction(null);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-green-50/50 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ModelSelector selectedModel={modelType} onModelChange={handleModelChange} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Input Parameters</h2>
              <p className="text-gray-500 mb-6">Enter the details of your farm to get a yield prediction.</p>
              <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Prediction Results</h2>
              <p className="text-gray-500 mb-6">
                Viewing forecast from the <span className="font-semibold text-green-700">{modelType === 'gemini' ? 'Gemini AI' : 'Local Python Model'}</span>.
              </p>
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}
              <PredictionResult result={prediction} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
      <Footer modelType={modelType} />
    </div>
  );
};

export default App;
