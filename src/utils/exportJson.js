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
