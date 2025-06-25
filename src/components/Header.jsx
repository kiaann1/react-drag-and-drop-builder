import React from 'react';

const Header = ({ onSave, onOpenTemplates }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs lg:text-sm">F</span>
            </div>
            <span className="text-base lg:text-lg font-semibold text-gray-900 hidden sm:block">Form Builder</span>
            <span className="text-sm font-semibold text-gray-900 sm:hidden">Builder</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-3">
          <button 
            onClick={onOpenTemplates}
            className="px-2 py-2 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-1 lg:space-x-2"
          >
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="hidden sm:inline">Templates</span>
          </button>
          <button 
            onClick={onSave}
            className="px-3 py-2 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <span className="hidden sm:inline">Save Form</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;