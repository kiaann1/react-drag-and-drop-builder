import React from 'react';

const Header = ({ onSave }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Form Builder</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;