import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

const formElementCategories = {
  basic: [
    { 
      type: 'text', 
      label: 'Text Input', 
      placeholder: 'Enter text',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    },
    { 
      type: 'paragraph', 
      label: 'Textarea', 
      placeholder: 'Enter paragraph text',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      type: 'email', 
      label: 'Email', 
      placeholder: 'Enter email address',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      type: 'phone', 
      label: 'Phone', 
      placeholder: 'Enter phone number',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    { 
      type: 'password', 
      label: 'Password', 
      placeholder: 'Enter password',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    { 
      type: 'hidden', 
      label: 'Hidden Field', 
      placeholder: 'Hidden value',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
      )
    },
  ],
  contact: [
    { 
      type: 'name', 
      label: 'Full Name', 
      placeholder: 'Enter full name',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      type: 'firstName', 
      label: 'First Name', 
      placeholder: 'Enter first name',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      type: 'lastName', 
      label: 'Last Name', 
      placeholder: 'Enter last name',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      type: 'company', 
      label: 'Company', 
      placeholder: 'Enter company name',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      type: 'jobTitle', 
      label: 'Job Title', 
      placeholder: 'Enter job title',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
        </svg>
      )
    },
    { 
      type: 'website', 
      label: 'Website', 
      placeholder: 'Enter website URL',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    { 
      type: 'address', 
      label: 'Address', 
      placeholder: 'Enter address',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      type: 'city', 
      label: 'City', 
      placeholder: 'Enter city',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      type: 'zipCode', 
      label: 'ZIP Code', 
      placeholder: 'Enter ZIP code',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      )
    },
    { 
      type: 'country', 
      label: 'Country', 
      placeholder: 'Select country',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ],
  choices: [
    { 
      type: 'select', 
      label: 'Dropdown', 
      placeholder: 'Select an option',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )
    },
    { 
      type: 'checkbox', 
      label: 'Checkboxes', 
      placeholder: '',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      type: 'radio', 
      label: 'Radio Buttons', 
      placeholder: '',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="10" strokeWidth={1} />
        </svg>
      )
    },
    { 
      type: 'multiselect', 
      label: 'Multi-Select', 
      placeholder: 'Select multiple options',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      type: 'rating', 
      label: 'Star Rating', 
      placeholder: 'Rate from 1-5',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      type: 'yesno', 
      label: 'Yes/No', 
      placeholder: '',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      type: 'scale', 
      label: 'Scale (1-10)', 
      placeholder: 'Select a value',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      )
    },
    { 
      type: 'like', 
      label: 'Like Scale', 
      placeholder: '',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ],
  advanced: [
    { 
      type: 'number', 
      label: 'Number', 
      placeholder: 'Enter number',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      )
    },
    { 
      type: 'date', 
      label: 'Date', 
      placeholder: 'Select date',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      type: 'time', 
      label: 'Time', 
      placeholder: 'Select time',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      )
    },
    { 
      type: 'datetime', 
      label: 'Date & Time', 
      placeholder: 'Select date and time',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      type: 'file', 
      label: 'File Upload', 
      placeholder: 'Choose file',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    { 
      type: 'image', 
      label: 'Image Upload', 
      placeholder: 'Choose image',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      type: 'range', 
      label: 'Range Slider', 
      placeholder: 'Select range',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        </svg>
      )
    },
    { 
      type: 'color', 
      label: 'Color Picker', 
      placeholder: 'Choose color',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    { 
      type: 'signature', 
      label: 'Signature', 
      placeholder: 'Digital signature',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    { 
      type: 'captcha', 
      label: 'CAPTCHA', 
      placeholder: 'Verify you are human',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
  ]
};

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

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
  } : undefined;

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
      <div className="text-gray-500 group-hover:text-blue-500 transition-colors flex-shrink-0">
        {element.icon}
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 truncate">
        {element.label}
      </span>
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
    password: ['password', 'pass', 'secret', 'auth'],
    hidden: ['hidden', 'invisible', 'secret'],
    rating: ['rating', 'stars', 'review', 'score'],
    yesno: ['yes no', 'yes/no', 'boolean', 'true false'],
    scale: ['scale', 'range', 'numeric scale', '1-10'],
    like: ['like', 'agreement scale', 'strongly agree'],
    datetime: ['datetime', 'date time', 'timestamp'],
    image: ['image', 'photo', 'picture', 'img'],
    range: ['range', 'slider', 'min max'],
    color: ['color', 'colour', 'picker'],
    signature: ['signature', 'sign', 'autograph', 'digital signature'],
    captcha: ['captcha', 'verification', 'security', 'bot protection'],
  };

  // Filter elements based on search term with enhanced matching
  const filterElements = (elements) => {
    if (!searchTerm) return elements;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    return elements.filter(element => {
      // Direct label match
      if (element.label.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Direct type match
      if (element.type.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Enhanced search terms match
      const elementSearchTerms = searchTerms[element.type] || [];
      return elementSearchTerms.some(term => 
        term.toLowerCase().includes(searchLower) || 
        searchLower.includes(term.toLowerCase())
      );
    });
  };

  // Get filtered elements for current tab
  const getFilteredElements = () => {
    if (searchTerm) {
      // If searching, show all matching elements regardless of tab
      const allElements = [
        ...formElementCategories.basic,
        ...formElementCategories.contact,
        ...formElementCategories.choices,
        ...formElementCategories.advanced
      ];
      return filterElements(allElements);
    }
    return formElementCategories[activeTab];
  };

  const filteredElements = getFilteredElements();

  // Update tab counts based on search
  const getTabCount = (category) => {
    if (!searchTerm) return formElementCategories[category].length;
    return filterElements(formElementCategories[category]).length;
  };

  const tabs = [
    { id: 'basic', label: 'Basic', count: getTabCount('basic') },
    { id: 'contact', label: 'Contact', count: getTabCount('contact') },
    { id: 'choices', label: 'Choices', count: getTabCount('choices') },
    { id: 'advanced', label: 'Advanced', count: getTabCount('advanced') },
  ];

  return (
    <div>

      {/* Tabs - hide when searching */}
      {!searchTerm && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-2 py-1 text-xs font-medium rounded transition-colors
                ${activeTab === tab.id 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Form Elements Grid */}
      {filteredElements.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {filteredElements.map((element) => (
            <DraggableElement key={`${element.type}-${searchTerm}`} element={element} />
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-sm">No fields match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {formElementCategories[activeTab].map((element) => (
            <DraggableElement key={element.type} element={element} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormElementsPalette;