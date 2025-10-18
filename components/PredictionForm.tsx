
import React, { useState } from 'react';
import type { PredictionInput } from '../types';

interface PredictionFormProps {
  onSubmit: (data: PredictionInput) => void;
  isLoading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PredictionInput>({
    crop: 'Corn',
    area: 50,
    soilType: 'Loam',
    annualRainfall: 700,
    avgTemperature: 22,
    nitrogen: 120,
    phosphorus: 50,
    potassium: 50,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'crop' || name === 'soilType' ? value : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="crop" className="block text-sm font-medium text-gray-700">Crop Type</label>
          <select id="crop" name="crop" value={formData.crop} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm">
            <option>Corn</option>
            <option>Wheat</option>
            <option>Rice</option>
            <option>Soybean</option>
            <option>Cotton</option>
          </select>
        </div>
        <div>
          <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">Soil Type</label>
          <select id="soilType" name="soilType" value={formData.soilType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm">
            <option>Loam</option>
            <option>Clay</option>
            <option>Sandy</option>
            <option>Silt</option>
            <option>Peat</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (hectares)</label>
          <input type="number" name="area" id="area" value={formData.area} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 50"/>
        </div>
        <div>
          <label htmlFor="annualRainfall" className="block text-sm font-medium text-gray-700">Annual Rainfall (mm)</label>
          <input type="number" name="annualRainfall" id="annualRainfall" value={formData.annualRainfall} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 700"/>
        </div>
      </div>
      
      <div>
        <label htmlFor="avgTemperature" className="block text-sm font-medium text-gray-700">Average Temperature (°C)</label>
        <input type="number" name="avgTemperature" id="avgTemperature" value={formData.avgTemperature} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 22"/>
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Fertilizer Levels (kg/ha)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nitrogen" className="block text-xs text-gray-500">Nitrogen (N)</label>
            <input type="number" name="nitrogen" id="nitrogen" value={formData.nitrogen} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 120"/>
          </div>
          <div>
            <label htmlFor="phosphorus" className="block text-xs text-gray-500">Phosphorus (P)</label>
            <input type="number" name="phosphorus" id="phosphorus" value={formData.phosphorus} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 50"/>
          </div>
          <div>
            <label htmlFor="potassium" className="block text-xs text-gray-500">Potassium (K)</label>
            <input type="number" name="potassium" id="potassium" value={formData.potassium} onChange={handleChange} className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 50"/>
          </div>
        </div>
      </div>
      
      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
          {isLoading ? 'Predicting...' : 'Predict Yield'}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;
