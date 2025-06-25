import React, { useState } from 'react';
import Swal from 'sweetalert2';
import FormElementsPalette from './FormElementsPalette';

const Sidebar = ({ onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleReset = () => {
    Swal.fire({
      title: 'Clear all fields?',
      text: 'Are you sure you want to clear all form fields? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear all',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onReset();
      }
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Add Fields</h2>
          <p className="text-xs text-gray-600 mb-4">
            Drag fields to add them to your form
          </p>
          
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <FormElementsPalette searchTerm={searchTerm} />
              <div className="p-6 border-t border-gray-200">
        <button 
          onClick={handleReset}
          className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors"
          title="Clear all form fields"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All Fields</span>
          </div>
        </button>
      </div>
      </div>

    </div>
  );
};

export default Sidebar;
