export function exportAsJson(formElements, formName = '', formOptions = {}) {
  return JSON.stringify({
    name: formName,
    elements: formElements.map(el => ({
      ...el,
      // Always include conditionalLogic as exported from ConditionalLogicModal
      conditionalLogic: el.conditionalLogic ? { ...el.conditionalLogic } : undefined,
      options: el.options || undefined,
      width: el.width || undefined,
      size: el.size || undefined,
      hideLabel: el.hideLabel || undefined,
      disabled: el.disabled || undefined,
      customClass: el.customClass || undefined,
      placeholder: el.placeholder || undefined,
      required: el.required || undefined,
      defaultValue: el.defaultValue || undefined,
      minLength: el.minLength || undefined,
      maxLength: el.maxLength || undefined,
      min: el.min || undefined,
      max: el.max || undefined,
      step: el.step || undefined,
      pattern: el.pattern || undefined,
      helpText: el.helpText || undefined,
      label: el.label || undefined,
      type: el.type,
      id: el.id,
    })),
    formOptions: { ...formOptions },
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0',
      totalElements: formElements.length,
      requiredElements: formElements.filter(el => el?.required).length,
    },
  }, null, 2);
}

// If you use conditional logic evaluation, update it:
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
    case 'true': return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    case 'false': return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
    default: return true;
  }
}
