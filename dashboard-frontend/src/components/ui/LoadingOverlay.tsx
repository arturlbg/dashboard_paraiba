import React from 'react';

interface LoadingOverlayProps {
  text?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = "Carregando dados..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]"> {/* Increased z-index */}
      <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
        {/* Simple spinner using Tailwind classes */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;