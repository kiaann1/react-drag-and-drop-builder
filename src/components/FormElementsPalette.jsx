import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import fields from '../../fields.json';

const DraggableElement = ({ element }) => {
  const label = element.label || element.name || element.type || "Field";

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
        p-2 lg:p-3 mb-2 bg-white border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing
        hover:border-blue-300 hover:shadow-sm transition-all duration-200
        flex items-center space-x-1 lg:space-x-2 group text-left
        ${isDragging ? 'opacity-40' : 'hover:opacity-100'}
      `}
    >
      <span className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" dangerouslySetInnerHTML={{ __html: element.icon || '' }} />
      <span className="text-xs font-medium text-gray-700 truncate">{label}</span>
    </div>
  );
};

const FormElementsPalette = ({ searchTerm = '' }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const categories = Array.from(
    fields.reduce((map, item) => {
      const cat = item.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(item);
      return map;
    }, new Map())
  );

  const filterElements = (elements) => {
    if (!searchTerm) return elements;
    const searchLower = searchTerm.toLowerCase().trim();
    return elements.filter(element =>
      (element.label || '').toLowerCase().includes(searchLower) ||
      (element.type || '').toLowerCase().includes(searchLower)
    );
  };

  return (
    <div>
      {categories.map(([category, items]) => (
              <div
                key={category}
                style={{
                  marginBottom: 16,
                  borderRadius: 10,
                  boxShadow: openCategory === category
                    ? "0 4px 16px 0 rgba(37,99,235,0.10)"
                    : "0 1px 4px 0 rgba(0,0,0,0.04)",
                  border: openCategory === category
                    ? "2px solid #2563eb"
                    : "1px solid #e5e7eb",
                  background: openCategory === category
                    ? "linear-gradient(90deg,#e0e7ff 0%,#f0f6ff 100%)"
                    : "#f8fafc",
                  transition: "all 0.2s"
                }}
              >
          <button
            type="button"
            onClick={() => setOpenCategory(openCategory === category ? null : category)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
              background: "none",
              border: "none",
              outline: "none",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: 6,
            }}
            aria-expanded={openCategory === category}
          >
            {category}
            <span style={{ float: "right", fontWeight: 400 }}>
              {openCategory === category ? "▲" : "▼"}
            </span>
          </button>
          {openCategory === category && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-2 p-2">
              {filterElements(items).map((element) => (
                <DraggableElement key={element.type} element={element} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormElementsPalette;