
import React from 'react';
import LeafIcon from './icons/LeafIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
             <div className="text-green-600">
                <LeafIcon />
             </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              AI Crop Yield Predictor
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
