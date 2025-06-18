import React, { useState } from 'react';
import fields from '../../fields.json';

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

  // Categorize fields from JSON
  const categories = {
    basic: [
      'text', 'message', 'email', 'phone'
    ],
    contact: [
      'name', 'firstName', 'lastName', 'company', 'jobTitle', 'website', 'address', 'city', 'post code', 'country'
    ],
    choices: [
      'select', 'checkbox', 'radio', 'multiselect', 'rating', 'yesno', 'scale'
    ],
    advanced: [
      'number', 'date', 'time', 'datetime', 'file', 'image', 'range', 'color'
    ]
  };

  // Map fields to categories
  const categorizedFields = Object.fromEntries(
    Object.entries(categories).map(([cat, types]) => [
      cat,
      fields.filter(f => types.includes(f.type))
    ])
  );

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

  // Get filtered elements for current tab
  const getFilteredElements = () => {
    if (searchTerm) {
      // If searching, show all matching elements regardless of tab
      const allElements = fields;
      return filterElements(allElements);
    }
    return categorizedFields[activeTab];
  };

  const filteredElements = getFilteredElements();

  // Update tab counts based on search
  const getTabCount = (category) => {
    if (!searchTerm) return categorizedFields[category].length;
    return filterElements(categorizedFields[category]).length;
  };

  const tabs = [
    { id: 'basic', label: 'Basic', count: getTabCount('basic') },
    { id: 'contact', label: 'Contact', count: getTabCount('contact') },
    { id: 'choices', label: 'Choices', count: getTabCount('choices') },
    { id: 'advanced', label: 'Advanced', count: getTabCount('advanced') },
  ];

  // Only show a preview of fields from fields.json, no field data/state is stored here
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
      <div className="grid grid-cols-2 gap-2">
        {fields
          .filter(f =>
            !searchTerm ||
            (f.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (f.type || '').toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((element) => (
            <div key={element.type} className="p-3 mb-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2">
              <span className="w-4 h-4" dangerouslySetInnerHTML={{ __html: element.icon || '' }} />
              <span className="text-xs font-medium text-gray-700 truncate">{element.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FormElementsPalette;