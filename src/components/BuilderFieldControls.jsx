import React from 'react';

const BuilderFieldControls = ({ onEdit, onOptions, onDelete, onLogic }) => (
  <div className="field-controls">
    <button onClick={onEdit}>Edit</button>
    <button onClick={onOptions}>Options</button>
    <button onClick={onLogic}>Logic</button>
    <button onClick={onDelete}>Delete</button>
  </div>
);

export default BuilderFieldControls;