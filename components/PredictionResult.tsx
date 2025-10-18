
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PredictionOutput } from '../types';
import Loader from './Loader';

interface PredictionResultProps {
  result: PredictionOutput | null;
  isLoading: boolean;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <Loader />
        <p className="mt-4 text-lg text-gray-600">Analyzing data and generating prediction...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center bg-gray-50 rounded-lg p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-4 text-lg text-gray-600">Your crop yield prediction will appear here once you submit the form.</p>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Yield',
      'Predicted Yield': result.predictedYield,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-gray-500">Predicted Yield</p>
        <p className="text-5xl font-bold text-green-600">
          {result.predictedYield.toFixed(2)}
          <span className="text-3xl font-medium text-gray-500 ml-2">{result.unit}</span>
        </p>
        <div className="mt-2 text-sm text-gray-600">
            Confidence: <span className="font-semibold text-green-700">{(result.confidenceScore * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
            <YAxis unit={` ${result.unit.split('/')[0]}`} tick={{ fill: '#6b7280' }} />
            <Tooltip
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar dataKey="Predicted Yield" fill="#10b981" barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h3>
        <ul className="space-y-4">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold text-green-800">{rec.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{rec.description}</p>
                </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PredictionResult;
