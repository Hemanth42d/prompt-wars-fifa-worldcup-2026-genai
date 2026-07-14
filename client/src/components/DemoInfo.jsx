import React from 'react';

/**
 * Demo Information Banner
 * Shows demo credentials for evaluators
 */
const DemoInfo = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            🎭 Demo User Available
          </h3>
          <p className="text-sm mb-4 opacity-95">
            Test the application instantly with pre-loaded sample data including chat history, match details, and navigation examples.
          </p>
          
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-white/20">
            <div className="text-center pb-2 border-b border-white/20">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-90">
                Demo Credentials
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs font-semibold opacity-90 block mb-1">Email</label>
                <div className="bg-black/30 px-4 py-2 rounded text-base font-mono font-semibold text-center">
                  demo@fifawc2026.com
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold opacity-90 block mb-1">Password</label>
                <div className="bg-black/30 px-4 py-2 rounded text-base font-mono font-semibold text-center">
                  Demo@2026
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-xs font-semibold mb-1">✨ What's Included:</p>
            <ul className="text-xs space-y-1 opacity-95">
              <li>• Pre-loaded chat history (English & Spanish)</li>
              <li>• Match ticket & stadium information</li>
              <li>• Navigation and accessibility data</li>
              <li>• Full GenAI chat functionality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoInfo;
