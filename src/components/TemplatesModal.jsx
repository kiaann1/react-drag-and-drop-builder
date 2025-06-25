import React, { useState } from 'react';
import { formTemplates, templateCategories, generateTemplateFields } from '../data/formTemplates';

const TemplatesModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter templates based on category and search term
  const filteredTemplates = formTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || 
      template.category.toLowerCase() === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template) => {
    const fieldsWithUniqueIds = generateTemplateFields(template);
    onSelectTemplate(fieldsWithUniqueIds);
    onClose();
  };

  const getTemplateIcon = (templateId) => {
    switch (templateId) {
      case 'simple-contact':
        return '📧';
      case 'multi-step-contact':
        return '📝';
      case 'job-application':
        return '💼';
      default:
        return '📋';
    }
  };

  const getFieldCount = (template) => {
    return template.fields.filter(field => field.type !== 'pageBreak').length;
  };

  const getStepCount = (template) => {
    const pageBreaks = template.fields.filter(field => field.type === 'pageBreak').length;
    return pageBreaks > 0 ? pageBreaks + 1 : 1;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with blur effect */}
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-25 transition-all duration-300" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-6xl sm:p-6 z-10 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h3 className="text-base lg:text-lg leading-6 font-medium text-gray-900">
                Form Templates
              </h3>
              <p className="mt-1 text-xs lg:text-sm text-gray-500">
                Choose a pre-built template to get started quickly
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors z-20 relative p-1"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-4 lg:mb-6 space-y-3 lg:space-y-4 relative z-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 lg:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 relative z-10"
              />
              <div className="absolute inset-y-0 left-0 pl-2 lg:pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 lg:gap-2 relative z-10">
              {templateCategories.map(category => (
                <button
                  key={category.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCategory(category.id);
                  }}
                  className={`px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-medium transition-colors relative z-10 cursor-pointer ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-h-80 lg:max-h-96 overflow-y-auto relative z-10">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group relative z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectTemplate(template);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTemplateIcon(template.id)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-500">{template.category}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{getFieldCount(template)} fields</span>
                  {getStepCount(template) > 1 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {getStepCount(template)} steps
                    </span>
                  )}
                </div>

                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectTemplate(template);
                    }}
                    className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition-colors relative z-10"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 relative z-10 space-y-3 sm:space-y-0">
            <div className="text-xs lg:text-sm text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex space-x-2 lg:space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="px-3 py-2 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 relative z-10"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="px-3 py-2 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 relative z-10"
              >
                Start Blank
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
