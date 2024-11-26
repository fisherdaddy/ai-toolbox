import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-indigo-600 font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
