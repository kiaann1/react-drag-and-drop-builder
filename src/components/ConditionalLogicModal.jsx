import React, { useState, useEffect, useRef } from 'react';

const defaultRule = { field: '', operator: 'equals', value: '' };

export default function ConditionalLogicModal({ isOpen, onClose, rules = [], onChange }) {
  const [localRules, setLocalRules] = useState(rules);
  const wasOpen = useRef(false);

  // Only reset localRules when modal is opened
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setLocalRules(rules || []);
    }
    wasOpen.current = isOpen;
  }, [isOpen, rules]);

  const handleAddRule = () => {
    setLocalRules(prev => [...(Array.isArray(prev) ? prev : []), { ...defaultRule }]);
  };

  const handleRuleChange = (idx, key, value) => {
    const updated = localRules.map((rule, i) =>
      i === idx ? { ...rule, [key]: value } : rule
    );
    setLocalRules(updated);
  };

  const handleRemoveRule = (idx) => {
    setLocalRules(localRules.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onChange && onChange(localRules);
    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Conditional Logic</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Rules</h4>
            {localRules.length === 0 && (
              <div className="text-gray-500 text-sm mb-4">No rules defined.</div>
            )}
            {localRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 mb-3 bg-gray-50 border border-gray-200 rounded p-2"
              >
                <input
                  placeholder="Field"
                  value={rule.field}
                  onChange={e => handleRuleChange(idx, 'field', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                />
                <select
                  value={rule.operator}
                  onChange={e => handleRuleChange(idx, 'operator', e.target.value)}
                  className="p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="greater_than">Greater Than</option>
                  <option value="less_than">Less Than</option>
                </select>
                <input
                  placeholder="Value"
                  value={rule.value}
                  onChange={e => handleRuleChange(idx, 'value', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => handleRemoveRule(idx)}
                  className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                  title="Remove rule"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={handleAddRule}
              className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 text-sm"
            >
              + Add New Rule
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Save Rules
          </button>
        </div>
      </div>
    </div>
  );
}
