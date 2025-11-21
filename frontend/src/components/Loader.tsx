import React from 'react';
import { useUIStore } from '../stores/uiStore';
import './Loader.css';

export const Loader: React.FC = () => {
  const { showSpinner, siteAssetLogo } = useUIStore();

  if (!showSpinner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
        <div className="spinner mb-4">
          {siteAssetLogo ? (
            <img
              src={siteAssetLogo}
              alt="HEDDIEKITCHEN"
              className="w-20 h-20 object-contain"
              style={{ animation: 'spin 2s linear infinite' }}
            />
          ) : (
            <div
              className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full"
              style={{ animation: 'spin 1s linear infinite' }}
            />
          )}
        </div>
        <p className="text-gray-600 text-center font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
