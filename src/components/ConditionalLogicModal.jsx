import React, { useState, useEffect, useMemo } from 'react';

// This component expects `formElements` to be the array of fields currently in the form builder (from FormBuilder state).
// It does NOT use the palette/sidebar fields, only those that have been dragged into the form.

const defaultRule = { field: '', operator: 'equals', value: '' };
const ACTIONS = [
  { value: 'show', label: 'Show this field' },
  { value: 'hide', label: 'Hide this field' },
  { value: 'enable', label: 'Enable this field' },
  { value: 'disable', label: 'Disable this field' },
  { value: 'require', label: 'Require this field' },
  { value: 'unrequire', label: 'Unrequire this field' },
];
// Add more operator types and value input types
const OPERATORS = [
  { value: 'equals', label: 'Equals', input: 'text' },
  { value: 'notEquals', label: 'Not Equals', input: 'text' },
  { value: 'contains', label: 'Contains', input: 'text' },
  { value: 'hasValue', label: 'Contains Any Characters/Numbers', input: null }, // <-- Added operator
  { value: 'greaterThan', label: 'Greater Than', input: 'number' },
  { value: 'lessThan', label: 'Less Than', input: 'number' },
  { value: 'isEmpty', label: 'Is Empty', input: null },
  { value: 'isNotEmpty', label: 'Is Not Empty', input: null },
  { value: 'startsWith', label: 'Starts With', input: 'text' },
  { value: 'endsWith', label: 'Ends With', input: 'text' },
  { value: 'matches', label: 'Matches (Regex)', input: 'text' },
  { value: 'in', label: 'Is One Of (comma separated)', input: 'text' },
  { value: 'notIn', label: 'Is Not One Of (comma separated)', input: 'text' },
  { value: 'checked', label: 'Is Checked', input: null },
  { value: 'notChecked', label: 'Is Not Checked', input: null },
  { value: 'true', label: 'Is True', input: null },
  { value: 'false', label: 'Is False', input: null },
];

// Add this definition above your component if missing:
const COMBINATORS = [
  { value: 'AND', label: 'All rules (AND)' },
  { value: 'OR', label: 'Any rule (OR)' },
];

// Helper to get the operator config
const getOperatorConfig = (operator) => OPERATORS.find(op => op.value === operator) || {};

export default function ConditionalLogicModal({
  isOpen,
  onClose,
  onChange,
  element,
  formElements = [],
}) {
  // Prevent rendering if element is missing or invalid
  if (!isOpen || !element || !element.id) return null;

  // Only update logic when element changes (not on open/close)
  const [logic, setLogic] = useState(element?.conditionalLogic || {
    active: false,
    action: 'show',
    rules: [],
    combinator: 'AND',
  });

  useEffect(() => {
    setLogic(element?.conditionalLogic || {
      active: false,
      action: 'show',
      rules: [],
      combinator: 'AND',
    });
  }, [element]);

  // Always update availableFields when formElements or element changes
  const availableFields = useMemo(() => {
    if (!Array.isArray(formElements)) return [];
    const currentId = element && element.id !== undefined && element.id !== null ? String(element.id) : '';
    return formElements.filter(f => {
      if (!f || f.id === undefined || f.id === null) return false;
      return String(f.id) !== currentId;
    });
  }, [formElements, element]);

  // Remove rules that reference fields no longer in the form
  useEffect(() => {
    setLogic(prev => {
      if (!prev.rules) return prev;
      const validFieldIds = new Set(availableFields.map(f => f.id));
      const filteredRules = prev.rules.filter(rule => !rule.field || validFieldIds.has(rule.field));
      // Only update if rules have changed
      if (filteredRules.length !== prev.rules.length) {
        return { ...prev, rules: filteredRules };
      }
      return prev;
    });
    // Only run when availableFields changes (i.e., formElements change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableFields]);

  // Only show warning if there are NO available fields
  const showNoFieldsWarning = availableFields.length === 0;
  const canAddRule = availableFields.length > 0;

  const handleActionChange = (e) => {
    setLogic(prev => ({ ...prev, action: e.target.value }));
  };

  const handleCombinatorChange = (e) => {
    setLogic(prev => ({ ...prev, combinator: e.target.value }));
  };

  const handleAddRule = () => {
    setLogic(prev => ({
      ...prev,
      rules: [...(Array.isArray(prev.rules) ? prev.rules : []), { ...defaultRule }],
    }));
  };

  const handleRuleChange = (idx, key, value) => {
    setLogic(prev => {
      const updatedRules = prev.rules.map((rule, i) => {
        if (i !== idx) return rule;
        // If operator changes, reset value if new operator doesn't need input
        if (key === 'operator') {
          const opConfig = getOperatorConfig(value);
          return {
            ...rule,
            operator: value,
            value: opConfig.input ? rule.value : '', // clear value if not needed
          };
        }
        return { ...rule, [key]: value };
      });
      return { ...prev, rules: updatedRules };
    });
  };

  const handleRemoveRule = (idx) => {
    setLogic(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = () => {
    // Only save if there are rules
    if (!logic.rules || logic.rules.length === 0) {
      onChange && onChange(undefined); // Remove conditional logic if no rules
      onClose && onClose();
      return;
    }
    onChange && onChange({ ...logic });
    onClose && onClose();
  };

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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <select
              value={logic.action}
              onChange={e => setLogic(prev => ({ ...prev, action: e.target.value }))}
              className="p-2 border border-gray-300 rounded text-sm"
            >
              {ACTIONS.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            <select
              value={logic.combinator}
              onChange={e => setLogic(prev => ({ ...prev, combinator: e.target.value }))}
              className="p-2 border border-gray-300 rounded text-sm"
            >
              {COMBINATORS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Rules</h4>
            {showNoFieldsWarning && (
              <div className="text-yellow-600 text-sm mb-4">
                No other fields available in the form to use for conditional logic.
              </div>
            )}
            {logic.rules.length === 0 && (
              <div className="text-gray-500 text-sm mb-4">No rules defined.</div>
            )}
            {logic.rules.map((rule, idx) => {
              const opConfig = getOperatorConfig(rule.operator);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 mb-3 bg-gray-50 border border-gray-200 rounded p-2"
                >
                  <select
                    value={rule.field}
                    onChange={e => handleRuleChange(idx, 'field', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    disabled={availableFields.length === 0}
                  >
                    <option value="">Select field…</option>
                    {availableFields.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.label || f.placeholder || f.id || 'Unnamed Field'}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rule.operator}
                    onChange={e => handleRuleChange(idx, 'operator', e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm"
                  >
                    {OPERATORS.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                  {/* Show value input if operator requires it */}
                  {opConfig.input === 'text' && (
                    <input
                      placeholder="Value"
                      value={rule.value}
                      onChange={e => handleRuleChange(idx, 'value', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      type="text"
                    />
                  )}
                  {opConfig.input === 'number' && (
                    <input
                      placeholder="Value"
                      value={rule.value}
                      onChange={e => handleRuleChange(idx, 'value', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      type="number"
                    />
                  )}
                  {/* No input for operators that don't need a value */}
                  <button
                    onClick={() => handleRemoveRule(idx)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    title="Remove rule"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            <button
              onClick={handleAddRule}
              className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 text-sm"
              disabled={!canAddRule}
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
            Save Logic
          </button>
        </div>
      </div>
    </div>
  );
}

// This file only defines the modal UI and logic configuration.
// The actual conditional logic (show/hide/enable/disable/require/unrequire fields based on rules)
// must be implemented in your form rendering/preview logic (not in this modal).

// To fix your live preview logic for "isEmpty" and "isNotEmpty":
/*
function evaluateRule(rule, formValues) {
  const value = formValues[rule.field];
  switch (rule.operator) {
    case 'equals': return value == rule.value;
    case 'notEquals': return value != rule.value;
    case 'contains': return value && value.includes(rule.value);
    case 'greaterThan': return parseFloat(value) > parseFloat(rule.value);
    case 'lessThan': return parseFloat(value) < parseFloat(rule.value);
    case 'isEmpty': return value === undefined || value === null || value === '';
    case 'isNotEmpty': return !(value === undefined || value === null || value === '');
    // ...other operators...
    default: return false;
  }
}
*/

// For "isEmpty", the rule should only match if the value is exactly '', null, or undefined.
// For "isNotEmpty", the rule should only match if the value is NOT '', null, or undefined.

// If your preview logic uses `!value` for "isEmpty", it will treat `0` and `false` as empty, which is incorrect for text fields.
// Use the above checks for correct behavior.

// In your form rendering logic, implement "hasValue" as:
/*
case 'hasValue':
  return typeof value === 'string' ? value.trim().length > 0 : !!value;
*/


