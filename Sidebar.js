import React from 'react';
import fields from './fields.json';

const Sidebar = () => (
  <div className="sidebar">
    {fields.map((field, idx) => (
      <div key={idx} className="sidebar-field">
        {field.label}
      </div>
    ))}
  </div>
);

export default Sidebar;