import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableFormElement from './SortableFormElement';
import FieldOptionsModal from './FieldOptionsModal';

const FormCanvas = ({
  formElements,
  onRemoveElement,
  onUpdateElement,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'form-canvas',
  });

  const validElements = formElements.filter(element => element && element.id);

  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [optionsModalElement, setOptionsModalElement] = useState(null);

  const openOptionsModal = (element) => {
    setOptionsModalElement(element);
    setOptionsModalOpen(true);
  };

  const handleFieldOptionsSave = (id, updatedData) => {
    if (onUpdateElement) {
      onUpdateElement(id, updatedData);
    }
  };

  return (
    <div className="w-full h-full bg-gray-100">
      <div className="p-6 h-full w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Form Builder</h3>
          <p className="text-sm text-gray-600">Drag and drop fields to build your form</p>
        </div>
        <div 
          ref={setNodeRef}
          className={`
            bg-white rounded-lg shadow-sm border-2 min-h-[700px] max-h-[700px] overflow-y-auto w-full
            ${isOver ? 'border-blue-400 bg-blue-50 border-solid' : 'border-gray-300 border-dashed'}
            ${validElements.length === 0 ? 'border-dashed' : 'border-solid border-gray-200'}
          `}
        >
          {validElements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Drop Fields Here</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Drag fields from the sidebar to start building your form
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="clearfix">
                <SortableContext
                  items={validElements.map(element => element.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {validElements.map((element) => (
                    <SortableFormElement
                      key={element.id}
                      element={element}
                      onRemove={onRemoveElement}
                      onUpdate={onUpdateElement}
                      formElements={formElements}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          )}
        </div>
      </div>
      <FieldOptionsModal
        isOpen={optionsModalOpen}
        onClose={() => setOptionsModalOpen(false)}
        onSave={handleFieldOptionsSave}
        element={optionsModalElement}
        onSwitchToEdit={() => setOptionsModalOpen(false)}
      />
    </div>
  );
};

export default FormCanvas;