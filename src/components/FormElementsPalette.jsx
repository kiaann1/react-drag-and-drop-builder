import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import fields from '../../fields.json';

// Draggable preview for each field
const DraggableElement = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${element.type}`,
    data: {
      type: 'form-element',
      elementType: element.type,
      label: element.label,
      placeholder: element.placeholder,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : 'auto',
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 mb-2 bg-white border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing
        hover:border-blue-300 hover:shadow-sm transition-all duration-200
        flex items-center space-x-2 group text-left
        ${isDragging ? 'opacity-40' : 'hover:opacity-100'}
      `}
    >
      <span className="w-4 h-4" dangerouslySetInnerHTML={{ __html: element.icon || '' }} />
      <span className="text-xs font-medium text-gray-700 truncate">{element.label}</span>
    </div>
  );
};

const FormElementsPalette = ({ searchTerm = '' }) => {
  const [activeTab, setActiveTab] = useState('basic');

  // Enhanced search terms mapping for better discoverability
  const searchTerms = {
    text: ['text', 'input', 'field', 'string'],
    paragraph: ['paragraph', 'para', 'textarea', 'text area', 'multiline', 'multi line'],
    email: ['email', 'e-mail', 'mail', 'address'],
    phone: ['phone', 'telephone', 'tel', 'mobile', 'number'],
    name: ['name', 'full name', 'first name', 'last name'],
    company: ['company', 'organization', 'business', 'org'],
    address: ['address', 'location', 'street', 'addr'],
    website: ['website', 'url', 'link', 'web', 'site'],
    select: ['select', 'dropdown', 'drop down', 'drop-down', 'choice', 'option'],
    checkbox: ['checkbox', 'check box', 'check boxes', 'checkboxes', 'check', 'boxes', 'tick', 'multiple choice'],
    radio: ['radio', 'radio button', 'radio buttons', 'single choice', 'option button'],
    multiselect: ['multiselect', 'multi select', 'multi-select', 'multiple select', 'multiple choice'],
    number: ['number', 'numeric', 'integer', 'decimal', 'num'],
    date: ['date', 'calendar', 'day', 'month', 'year'],
    time: ['time', 'hour', 'minute', 'clock'],
    file: ['file', 'upload', 'attachment', 'document', 'doc'],
    firstName: ['first name', 'firstname', 'given name', 'forename'],
    lastName: ['last name', 'lastname', 'surname', 'family name'],
    jobTitle: ['job title', 'position', 'role', 'occupation', 'title'],
    city: ['city', 'town', 'municipality'],
    zipCode: ['zip code', 'zip', 'postal code', 'postcode'],
    country: ['country', 'nation', 'nationality'],
    rating: ['rating', 'stars', 'review', 'score'],
    yesno: ['yes no', 'yes/no', 'boolean', 'true false'],
    scale: ['scale', 'range', 'numeric scale', '1-10'],
    like: ['like', 'agreement scale', 'strongly agree'],
    datetime: ['datetime', 'date time', 'timestamp'],
    image: ['image', 'photo', 'picture', 'img'],
    range: ['range', 'slider', 'min max'],
    color: ['color', 'colour', 'picker'],
  };


  // Filter elements based on search term with enhanced matching
  const filterElements = (elements) => {
    if (!searchTerm) return elements;

    const searchLower = searchTerm.toLowerCase().trim();

    return elements.filter(element => {
      if ((element.label || '').toLowerCase().includes(searchLower)) return true;
      if ((element.type || '').toLowerCase().includes(searchLower)) return true;
      if (element.aliases && element.aliases.some(term =>
        term.toLowerCase().includes(searchLower) ||
        searchLower.includes(term.toLowerCase())
      )) return true;
      return false;
    });
  };


  // Only show a preview of fields from fields.json, no field data/state is stored here
  return (
    <div>
      {/* Form Elements Grid */}
      <div className="grid grid-cols-2 gap-2">
        {fields
          .filter(f =>
            !searchTerm ||
            (f.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (f.type || '').toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((element) => (
            <DraggableElement key={element.type} element={element} />
          ))}
      </div>
    </div>
  );
};

export default FormElementsPalette;