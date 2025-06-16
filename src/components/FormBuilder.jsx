import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import Header from './Header';
import Sidebar from './Sidebar';
import FormCanvas from './FormCanvas';
import LivePreview from './LivePreview';
import SaveFormModal from './SaveFormModal';

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [formOptions, setFormOptions] = useState({});
  const [error, setError] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Input validation and sanitization
  const validateElementData = useCallback((data) => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid element data');
    }

    const requiredFields = ['id', 'type', 'label'];
    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'string') {
        throw new Error(`Missing or invalid required field: ${field}`);
      }
    }

    // Sanitize string inputs to prevent XSS
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
        .slice(0, 1000); // Limit length
    };

    const sanitizedData = {
      ...data,
      label: sanitizeString(data.label),
      placeholder: data.placeholder ? sanitizeString(data.placeholder) : '',
      helpText: data.helpText ? sanitizeString(data.helpText) : '',
      defaultValue: data.defaultValue ? sanitizeString(data.defaultValue) : '',
      customClass: data.customClass ? sanitizeString(data.customClass).replace(/[^a-zA-Z0-9-_]/g, '') : '',
    };

    // Validate numeric inputs
    if (data.minLength !== undefined) {
      const minLength = parseInt(data.minLength, 10);
      if (isNaN(minLength) || minLength < 0) {
        throw new Error('Invalid minLength value');
      }
      sanitizedData.minLength = minLength;
    }

    if (data.maxLength !== undefined) {
      const maxLength = parseInt(data.maxLength, 10);
      if (isNaN(maxLength) || maxLength < 0 || maxLength > 10000) {
        throw new Error('Invalid maxLength value');
      }
      sanitizedData.maxLength = maxLength;
    }

    // Validate options array
    if (data.options && Array.isArray(data.options)) {
      sanitizedData.options = data.options.slice(0, 50).map(option => ({
        label: sanitizeString(option.label || ''),
        value: sanitizeString(option.value || ''),
      }));
    }

    return sanitizedData;
  }, []);

  const handleDragStart = useCallback((event) => {
    try {
      setActiveId(event.active.id);
      setError(null);
    } catch (err) {
      console.error('Drag start error:', err);
      setError('Failed to start drag operation');
    }
  }, []);

  const handleDragEnd = useCallback((event) => {
    try {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      if (active.id.startsWith('palette-')) {
        // Adding new element from palette
        const elementType = active.id.replace('palette-', '');
        const newElement = {
          id: `element-${Date.now()}`,
          type: elementType,
          label: elementType.charAt(0).toUpperCase() + elementType.slice(1),
          required: false,
          placeholder: '',
          helpText: '',
          defaultValue: '',
          options: ['select', 'radio', 'checkbox', 'multiselect'].includes(elementType) 
            ? [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] 
            : [],
        };

        const validatedElement = validateElementData(newElement);
        
        setFormElements(prev => {
          if (prev.length >= 100) { // Limit number of elements
            setError('Maximum number of form elements reached (100)');
            return prev;
          }
          return [...prev, validatedElement];
        });
      }
    } catch (err) {
      console.error('Drag end error:', err);
      setError(err.message || 'Failed to add form element');
    }
  }, [validateElementData]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const updateElement = useCallback((id, updatedData) => {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid element ID');
      }

      const validatedData = validateElementData(updatedData);
      
      setFormElements(prevElements => {
        const elementExists = prevElements.some(element => element.id === id);
        if (!elementExists) {
          throw new Error('Element not found');
        }
        
        return prevElements.map(element =>
          element.id === id ? { ...element, ...validatedData } : element
        );
      });
      
      setError(null);
    } catch (err) {
      console.error('Update element error:', err);
      setError(err.message || 'Failed to update form element');
    }
  }, [validateElementData]);

  const removeElement = useCallback((id) => {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid element ID');
      }

      setFormElements(prevElements => {
        const filtered = prevElements.filter(element => element && element.id !== id);
        if (filtered.length === prevElements.length) {
          throw new Error('Element not found');
        }
        return filtered;
      });
      
      setError(null);
    } catch (err) {
      console.error('Remove element error:', err);
      setError(err.message || 'Failed to remove form element');
    }
  }, []);

  const handleReset = useCallback(() => {
    try {
      if (formElements.length === 0) {
        setError('No elements to reset');
        return;
      }

      if (window.confirm('Are you sure you want to reset the form? This will remove all fields.')) {
        setFormElements([]);
        setFormOptions({});
        setError(null);
      }
    } catch (err) {
      console.error('Reset error:', err);
      setError('Failed to reset form');
    }
  }, [formElements.length]);

  const handleSave = useCallback(() => {
    try {
      if (formElements.length === 0) {
        setError('Please add some fields to your form before saving');
        return;
      }

      // Validate all elements before opening save modal
      formElements.forEach(element => validateElementData(element));
      
      setShowSaveModal(true);
      setError(null);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save form');
    }
  }, [formElements, validateElementData]);

  const togglePreviewExpand = useCallback(() => {
    setIsPreviewExpanded(prev => !prev);
  }, []);

  const handleUpdateFormOptions = useCallback((newOptions) => {
    try {
      if (!newOptions || typeof newOptions !== 'object') {
        throw new Error('Invalid form options');
      }

      // Sanitize form options
      const sanitizedOptions = {
        ...newOptions,
        formTitle: newOptions.formTitle ? String(newOptions.formTitle).slice(0, 200) : '',
        formDescription: newOptions.formDescription ? String(newOptions.formDescription).slice(0, 1000) : '',
        submitButtonText: newOptions.submitButtonText ? String(newOptions.submitButtonText).slice(0, 100) : 'Submit Form',
        successMessage: newOptions.successMessage ? String(newOptions.successMessage).slice(0, 500) : '',
        errorMessage: newOptions.errorMessage ? String(newOptions.errorMessage).slice(0, 500) : '',
        redirectUrl: newOptions.redirectUrl ? String(newOptions.redirectUrl).slice(0, 500) : '',
      };

      // Validate color values
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const colorFields = ['submitButtonColor', 'submitButtonHoverColor', 'submitButtonTextColor', 'labelTextColor', 'placeholderTextColor', 'inputTextColor', 'inputBorderColor', 'inputFocusBorderColor', 'backgroundColor', 'containerBackgroundColor'];
      
      colorFields.forEach(field => {
        if (sanitizedOptions[field] && !colorRegex.test(sanitizedOptions[field])) {
          delete sanitizedOptions[field]; // Remove invalid color values
        }
      });

      setFormOptions(sanitizedOptions);
      setError(null);
    } catch (err) {
      console.error('Update form options error:', err);
      setError(err.message || 'Failed to update form options');
    }
  }, []);

  // Memoize expensive operations
  const memoizedFormElements = useMemo(() => formElements, [formElements]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSave={handleSave} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-4 mt-4">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-4 w-4 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex w-full" style={{ height: 'calc(100vh - 73px)' }}>
          {!isPreviewExpanded && (
            <>
              <div className="w-80 flex-shrink-0">
                <Sidebar onReset={handleReset} />
              </div>
              <div className="flex-1 min-w-0">
                <FormCanvas 
                  formElements={formElements} 
                  onRemoveElement={removeElement}
                  onUpdateElement={updateElement}
                />
              </div>
            </>
          )}
          <LivePreview 
            formElements={formElements} 
            isExpanded={isPreviewExpanded}
            onToggleExpand={togglePreviewExpand}
            formOptions={formOptions}
            onUpdateFormOptions={handleUpdateFormOptions}
          />
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-white border-2 border-blue-400 rounded-lg p-4 shadow-xl opacity-90">
              <div className="text-sm font-medium text-gray-900">
                {activeId.startsWith('palette-') ? 'Adding field...' : 'Moving field...'}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <SaveFormModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        formElements={memoizedFormElements}
        formOptions={formOptions}
      />
    </div>
  );
};

export default FormBuilder;
