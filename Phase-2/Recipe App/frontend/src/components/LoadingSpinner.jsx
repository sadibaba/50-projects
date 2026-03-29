import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-red-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-2xl animate-pulse">🍳</span>
        </div>
      </div>
      <p className="text-gray-400 animate-pulse">Finding delicious recipes...</p>
    </div>
  );
};

export default LoadingSpinner;