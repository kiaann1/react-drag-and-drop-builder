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
import Swal from 'sweetalert2';

import Header from './Header';
import Sidebar from './Sidebar';
import FormCanvas from './FormCanvas';
import LivePreview from './LivePreview';
import SaveFormModal from './SaveFormModal';
import TemplatesModal from './TemplatesModal';

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [formOptions, setFormOptions] = useState({});
  const [error, setError] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

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
        let defaultOptions = [];
        let defaultLabel = '';
        if (elementType === 'checkbox') {
          defaultOptions = [{ label: 'Checkbox', value: 'checked' }];
          defaultLabel = 'Checkbox';
        } else if (['select', 'radio', 'multiselect'].includes(elementType)) {
          defaultOptions = [{ label: 'Option 1', value: 'checked' }];
          defaultLabel = 'Option 1';
        } else {
          // Capitalize first letter of type for label
          defaultLabel = elementType.charAt(0).toUpperCase() + elementType.slice(1);
        }
        const newElement = {
          id: `element-${Date.now()}`,
          type: elementType,
          label: defaultLabel,
          required: false,
          placeholder: '',
          helpText: '',
          defaultValue: '',
          options: defaultOptions,
        };

        const validatedElement = validateElementData(newElement);
        
        setFormElements(prev => {
          if (prev.length >= 100) { // Limit number of elements
            setError('Maximum number of form elements reached (100)');
            return prev;
          }
          return [...prev, validatedElement];
        });
      } else {
        // Handle reordering of existing elements
        const oldIndex = formElements.findIndex(el => el.id === active.id);
        const newIndex = formElements.findIndex(el => el.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          setFormElements(prev => arrayMove(prev, oldIndex, newIndex));
        }
      }
    } catch (err) {
      console.error('Drag end error:', err);
      setError(err.message || 'Failed to add form element');
    }
  }, [validateElementData, formElements]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const updateElement = useCallback((id, updatedData) => {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid element ID');
      }

      // No validation here, just update the element with new data (including options)
      setFormElements(prevElements => {
        const elementExists = prevElements.some(element => element.id === id);
        if (!elementExists) {
          throw new Error('Element not found');
        }
        return prevElements.map(element =>
          element.id === id ? { ...element, ...updatedData } : element
        );
      });
      setError(null);
    } catch (err) {
      console.error('Update element error:', err);
      setError(err.message || 'Failed to update form element');
    }
  }, []);

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

      Swal.fire({
        title: 'Are you sure?',
        text: 'This will remove all fields. This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, reset form',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          setFormElements([]);
          setFormOptions({});
          setError(null);
          Swal.fire({
            title: 'Reset Complete!',
            text: 'Your form has been cleared.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
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

  const handleOpenTemplates = useCallback(() => {
    setShowTemplatesModal(true);
  }, []);

  const handleSelectTemplate = useCallback((templateFields) => {
    try {
      if (!Array.isArray(templateFields)) {
        throw new Error('Invalid template fields');
      }

      // If there are existing form elements, ask for confirmation
      if (formElements.length > 0) {
        Swal.fire({
          title: 'Replace current form?',
          text: 'This will replace all current form fields with the selected template. Do you want to continue?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3b82f6',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, use template',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            applyTemplate();
          }
        });
      } else {
        applyTemplate();
      }

      function applyTemplate() {
        // Validate each template field
        const validatedFields = templateFields.map(field => validateElementData(field));
        
        // Replace current form elements with template fields (clear existing and set new)
        setFormElements(validatedFields);
        setShowTemplatesModal(false);
        setError(null);
        
        // Show success message
        Swal.fire({
          title: 'Template Applied!',
          text: `Successfully loaded template with ${validatedFields.length} fields.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        console.log('Template applied successfully - replaced', formElements.length, 'existing fields with', validatedFields.length, 'template fields');
      }
    } catch (err) {
      console.error('Select template error:', err);
      setError(err.message || 'Failed to apply template');
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Failed to apply template',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  }, [validateElementData, formElements.length]);

  // Memoize expensive operations
  const memoizedFormElements = useMemo(() => formElements, [formElements]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSave={handleSave} onOpenTemplates={handleOpenTemplates} />
    
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col lg:flex-row w-full" style={{ minHeight: 'calc(100vh - 73px)' }}>
          {!isPreviewExpanded && (
            <>
              {/* Sidebar: Full width on mobile, fixed width on desktop */}
              <div className="w-full lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
                <Sidebar onReset={handleReset} />
              </div>
              {/* Form Canvas: Full width on mobile, flex-1 on desktop */}
              <div className="flex-1 min-w-0 order-1 lg:order-2">
                <FormCanvas 
                  formElements={formElements} 
                  onRemoveElement={removeElement}
                  onUpdateElement={updateElement}
                />
              </div>
            </>
          )}
          {/* LivePreview: Always visible, responsive */}
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

      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};

export default FormBuilder;
