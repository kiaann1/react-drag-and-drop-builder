// Add conditional logic evaluation
function evaluateCondition(rule, formValues) {
  const { field, operator, value } = rule;
  const fieldValue = formValues[field];

  switch (operator) {
    case 'equals': return fieldValue == value;
    case 'notEquals': return fieldValue != value;
    case 'contains': return String(fieldValue ?? '').includes(value);
    case 'greaterThan': return Number(fieldValue) > Number(value);
    case 'lessThan': return Number(fieldValue) < Number(value);
    case 'isEmpty': return !fieldValue || fieldValue === '';
    case 'isNotEmpty': return !!fieldValue && fieldValue !== '';
    case 'startsWith': return String(fieldValue ?? '').startsWith(value);
    case 'endsWith': return String(fieldValue ?? '').endsWith(value);
    case 'matches':
      try { return new RegExp(value).test(fieldValue ?? ''); } catch { return false; }
    case 'in':
      return value.split(',').map(v => v.trim()).includes(fieldValue);
    case 'notIn':
      return !value.split(',').map(v => v.trim()).includes(fieldValue);
    // --- Updated logic for isChecked and notChecked ---
    case 'checked':
    case 'isChecked':
      if (Array.isArray(fieldValue)) {
        if (value && value !== '') {
          return fieldValue.includes(value);
        }
        return fieldValue.length > 0;
      }
      if (typeof fieldValue === 'string') {
        if (value && value !== '') {
          return fieldValue === value;
        }
        return !!fieldValue;
      }
      return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    case 'notChecked':
      if (Array.isArray(fieldValue)) {
        if (value && value !== '') {
          return !fieldValue.includes(value);
        }
        return fieldValue.length === 0;
      }
      if (typeof fieldValue === 'string') {
        if (value && value !== '') {
          return fieldValue !== value;
        }
        return !fieldValue;
      }
      return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
    case 'true':
    case 'isTrue':
      if (Array.isArray(fieldValue)) {
        if (value && value !== '') {
          return fieldValue.includes(value);
        }
        return fieldValue.length > 0;
      }
      if (typeof fieldValue === 'string') {
        if (value && value !== '') {
          return fieldValue === value;
        }
        return !!fieldValue;
      }
      return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    case 'false':
      return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
    default: return true;
  }
}

function evaluateLogic(conditionalLogic, formValues) {
  if (!conditionalLogic || !conditionalLogic.rules || conditionalLogic.rules.length === 0) return true;
  const { rules, combinator, action } = conditionalLogic;
  const results = rules.map(rule => evaluateCondition(rule, formValues));
  const passed = (combinator === 'OR' ? results.some(Boolean) : results.every(Boolean));
  if (action === 'show') return passed;
  if (action === 'hide') return !passed;
  // For enable/disable/require/unrequire, always show, but you can add logic for those as needed
  return true;
}

export default function generateHTML(formData, formValues = {}) {
    if (!Array.isArray(formData)) return '<form></form>';
    let html = '<form>';
    formData.forEach(field => {
        // Only render field if conditional logic passes
        if (field.conditionalLogic && !evaluateLogic(field.conditionalLogic, formValues)) return;
        html += `<label>${field.label}</label>`;
        html += `<input type="${field.type}" name="${field.name}" />`;
    });
    html += '</form>';
    return html;
}
