import React from 'react';

interface FooterProps {
    modelType: 'gemini' | 'local';
}

const Footer: React.FC<FooterProps> = ({ modelType }) => {
  const powerSource = modelType === 'gemini' ? 'Gemini' : 'a Local Python Model';

  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto py-4 px-4 md:px-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Crop Yield Predictor. Powered by {powerSource}.</p>
      </div>
    </footer>
  );
};

export default Footer;
