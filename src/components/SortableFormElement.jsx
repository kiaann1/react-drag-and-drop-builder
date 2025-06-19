import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import EditFieldModal from './EditFieldModal';
import ConditionalLogicModal from './ConditionalLogicModal';
import FieldOptionsModal from './FieldOptionsModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import StarRating from './StarRating';

const SortableFormElement = ({ element, onRemove, onUpdate, formElements }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogicModal, setShowLogicModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: element.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Combine refs
  const setNodeRef = (node) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const getContainerClasses = () => {
    const width = element.width || 'full'; // Default to full if undefined
    switch (width) {
      case 'half':
        return "w-1/2 pr-2 inline-block align-top";
      case 'third':
        return "w-1/3 pr-2 inline-block align-top";
      case 'quarter':
        return "w-1/4 pr-2 inline-block align-top";
      default: // full
        return "w-full";
    }
  };

  const renderFormElement = () => {
    // Get default options if none exist
    const getElementOptions = () => {
      if (element.options && element.options.length > 0) {
        return element.options;
      }
      switch (element.type) {
        case 'select':
        case 'radio':
        case 'multiselect':
        case 'checkbox':
          return [
            { label: '', value: 'checked' },
          ];
        default:
          return [];
      }
    };

    // Render for checkbox type
    if (element.type === 'checkbox') {
      // Always render a single checkbox, regardless of options length
      return (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="border-gray-300"
            disabled
          />
          <span className="text-gray-700 text-sm">{element.label || "Checkbox"}</span>
        </label>
      );
    }

    switch (element.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'name':
      case 'firstName':
      case 'lastName':
      case 'company':
      case 'jobTitle':
      case 'address':
      case 'city':
      case 'zipCode':
      case 'website':
        return (
          <input
            id={element.id}
            name={element.id}
            type={element.type === 'name' || element.type === 'firstName' || element.type === 'lastName' || element.type === 'company' || element.type === 'jobTitle' || element.type === 'address' || element.type === 'city' || element.type === 'zipCode' ? 'text' : element.type === 'website' ? 'url' : element.type}
            placeholder={element.placeholder || `Enter ${element.type}`}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        );
      case 'datetime':
        return (
          <input
            type="datetime-local"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={element.min || 0}
              max={element.max || 100}
              step={element.step || 1}
              defaultValue={element.defaultValue || 50}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{element.min || 0}</span>
              <span className="font-medium">Value: {element.defaultValue || 50}</span>
              <span>{element.max || 100}</span>
            </div>
          </div>
        );

      case 'color':
        return (
          <input
            type="color"
            className="h-10 w-20 border border-gray-300 rounded-md"
            disabled
          />
        );

      case 'country':
        return (
          <select 
            id={element.id}
            name={element.id}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            disabled
          >
            <option value="">{element.placeholder || 'Select a country'}</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="AU">Australia</option>
          </select>
        );

      case 'rating':
        return (
          <StarRating 
            value={0}
            readonly={true}
            size="w-6 h-6"
          />
        );

      case 'likert':
        return (
          <div className="space-y-2">
            {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input 
                  id={`${element.id}_${index}`}
                  name={element.id}
                  type="radio" 
                  className="border-gray-300" 
                  disabled 
                />
                <span className="text-gray-700 text-sm">{option}</span>
              </label>
            ))}
          </div>
        );


      default:
        return <div className="text-gray-500">Field type: {element.type}</div>;
    }
  };

  const handleEdit = () => setShowEditModal(true);
  const handleLogic = () => setShowLogicModal(true);
  const handleOptions = () => setShowOptionsModal(true);
  const handleDelete = () => setShowDeleteModal(true);

  const handleSaveEdit = (elementId, updatedData) => {
    onUpdate(elementId, updatedData);
  };

  const handleSaveLogic = (elementId, updatedData) => {
    onUpdate(elementId, updatedData);
  };

  const handleSaveOptions = (elementId, updatedData) => {
    onUpdate(elementId, updatedData);
  };

  const handleConfirmDelete = () => {
    onRemove(element.id);
    setShowDeleteModal(false);
  };

  const switchToOptions = () => {
    setShowEditModal(false);
    setShowOptionsModal(true);
  };

  const switchToEdit = () => {
    setShowOptionsModal(false);
    setShowEditModal(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
          mb-4 p-4 bg-white border rounded-lg group hover:border-gray-300 transition-colors relative
          ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
          ${isDragging ? 'z-50' : ''}
          ${getContainerClasses()}
        `}
      >
        {/* Drop indicator when hovering */}
        {isOver && (
          <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-400 rounded"></div>
        )}
        
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-2 rounded hover:bg-gray-100 transition-colors"
              title="Drag to reorder"
            >
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {element.width && element.width !== 'full' && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Width: {element.width === 'half' ? '50%' : element.width === 'third' ? '33%' : element.width === 'quarter' ? '25%' : '100%'}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleEdit}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 p-1 rounded transition-all"
              title="Edit field"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
            </button>
            <button
              onClick={handleOptions}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-600 p-1 rounded transition-all"
              title="Field options"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
              </svg>
            </button>
            <button
              onClick={handleLogic}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 p-1 rounded transition-all"
              title="Logic"
            >
              {/* Changed to a sliders/settings icon to differentiate from edit */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16M9 6v12m6-6v6" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-1 rounded transition-all"
              title="Delete field"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
        {renderFormElement()}
      </div>

      {/* Modals */}
      <EditFieldModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        element={element}
        onSwitchToOptions={switchToOptions}
      />

      <ConditionalLogicModal
        isOpen={showLogicModal}
        onClose={() => setShowLogicModal(false)}
        onChange={(logic) => onUpdate(element.id, { ...element, conditionalLogic: logic })}
        element={element}
        formElements={formElements}
      />

      <FieldOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onSave={handleSaveOptions}
        element={element}
        onSwitchToEdit={switchToEdit}
      />
      
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        fieldLabel={element.label}
      />
    </>
  );
};

export default SortableFormElement;