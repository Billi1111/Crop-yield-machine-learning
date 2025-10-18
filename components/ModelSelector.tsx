import React from 'react';

type ModelType = 'gemini' | 'local';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const baseButtonClasses = "px-6 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out transform hover:scale-105";
  const activeButtonClasses = "bg-green-600 text-white shadow-md";
  const inactiveButtonClasses = "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300";

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 max-w-lg mx-auto mb-6">
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => onModelChange('gemini')}
          className={`${baseButtonClasses} ${selectedModel === 'gemini' ? activeButtonClasses : inactiveButtonClasses}`}
          aria-pressed={selectedModel === 'gemini'}
        >
          🤖 Gemini AI
        </button>
        <button
          onClick={() => onModelChange('local')}
          className={`${baseButtonClasses} ${selectedModel === 'local' ? activeButtonClasses : inactiveButtonClasses}`}
          aria-pressed={selectedModel === 'local'}
        >
          🐍 Local Python Model
        </button>
      </div>
      <p className="text-center text-xs text-gray-500 mt-2 px-2">
        {selectedModel === 'gemini'
          ? 'Uses Google Gemini for nuanced predictions and detailed recommendations.'
          : 'Uses a local model. Requires the Python server to be running separately.'}
      </p>
    </div>
  );
};

export default ModelSelector;
