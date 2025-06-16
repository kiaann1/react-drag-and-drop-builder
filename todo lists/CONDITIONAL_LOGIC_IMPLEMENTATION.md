# Conditional Logic Implementation Plan

## Overview and Goals

form builder needs to support conditional logic between fields while:
- Maintaining clean code architecture
- Not affecting performance 
- Supporting all export formats
- Keeping the implementation modular


## 1. Data Structure for Conditional Logic

Each form element will have a new property called `conditionalLogic`:

```javascript
{
  conditionalLogic: {
    active: true, // Whether logic is active for this field
    action: "show", // "show" | "hide" | "enable" | "disable" | "require" | "unrequire"
    rules: [
      {
        // A single rule
        field: "fieldId123",  // ID of the field this rule depends on
        operator: "equals", // "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan" | "isEmpty" | "isNotEmpty"
        value: "Yes" // Value to compare against
      }
    ],
    combinator: "AND" // "AND" | "OR" - How to combine multiple rules
  }
}
```

This structure is compact yet flexible enough to support a wide range of conditions.

## 2. UI Implementation

### Conditional Logic Tab in Field Edit Modal

1. Add a "Logic" tab to the field edit modal alongside "Settings" and "Validation"
2. The UI will have:
   - Enable/disable toggle for conditional logic
   - Action dropdown (show/hide/etc.)
   - Rule builder interface with:
     - Field selector (dropdown of available fields)
     - Operator selector
     - Value input (adapts to the selected field type)
   - "Add Rule" button for additional rules
   - "AND/OR" selector for multiple rules

### UI/UX Considerations

- Show available fields that can be selected for conditions (fields that appear before current field)
- Display dynamic tooltips for each operator
- Preview the condition effect in the builder

## 3. Condition Evaluation

For evaluating conditions, we'll create a modular utility function:

```javascript
// utils/evaluateConditions.js
export const evaluateCondition = (rule, formData) => {
  const { field, operator, value } = rule;
  const fieldValue = formData[field];
  
  switch(operator) {
    case 'equals': return fieldValue === value;
    case 'notEquals': return fieldValue !== value;
    case 'contains': return String(fieldValue).includes(value);
    case 'greaterThan': return Number(fieldValue) > Number(value);
    case 'lessThan': return Number(fieldValue) < Number(value);
    case 'isEmpty': return !fieldValue || fieldValue === '';
    case 'isNotEmpty': return !!fieldValue && fieldValue !== '';
    default: return true;
  }
};

export const evaluateLogic = (conditionalLogic, formData) => {
  if (!conditionalLogic || !conditionalLogic.active) return true;
  
  const { rules, combinator } = conditionalLogic;
  
  if (rules.length === 0) return true;
  
  const results = rules.map(rule => evaluateCondition(rule, formData));
  
  return combinator === 'AND'
    ? results.every(result => result)
    : results.some(result => result);
};
```

## 4. Implementation in the Form Builder

### Live Preview Component

```jsx
// Pseudo-code
const FormPreview = ({ formElements, formData, onChange }) => {
  return (
    <form>
      {formElements.map(element => {
        // Check if element should be shown based on conditionalLogic
        const isVisible = evaluateLogic(element.conditionalLogic, formData);
        
        if (!isVisible) return null;
        
        return (
          <FormField 
            key={element.id}
            element={element}
            value={formData[element.id]}
            onChange={value => onChange({ ...formData, [element.id]: value })}
          />
        );
      })}
    </form>
  );
};
```

### Performance Optimizations

1. Only re-evaluate conditions when dependent field values change
2. Use React.memo for field components
3. Track field dependencies in a map for O(1) lookups
4. Cache evaluation results where possible

## 5. Export Implementations

Different export formats will handle conditional logic differently:

### JSON Export
- Include the `conditionalLogic` property directly

### React Component Export
- Include the evaluateLogic utility in the exported code
- Add conditional rendering logic using the utility

```jsx
// React export code snippet
{formElements.map(element => {
  const isVisible = evaluateLogic(element.conditionalLogic, formData);
  if (!isVisible) return null;
  
  return <Field {...element} />;
})}
```

### HTML/Bootstrap Export
- Add JavaScript that handles the conditional logic
- Use HTML data attributes to store the logic rules
- Add event listeners to fields that other fields depend on

```html
<!-- Example HTML + JS -->
<div data-conditional-field 
     data-logic='{"action":"show","rules":[{"field":"choice","operator":"equals","value":"yes"}]}'>
  <!-- Field content -->
</div>

<script>
  // Simple utility for DOM manipulation
  document.addEventListener('DOMContentLoaded', function() {
    setupConditionalLogic();
  });
  
  function setupConditionalLogic() {
    // Add input change listeners
    // Evaluate and apply conditions
  }
</script>
```

### WordPress Shortcode Export
- Include custom JavaScript that applies the same conditional logic
- Use WordPress form field hooks where possible

## 6. Code Organization

To keep the codebase clean and modular:

1. Isolate all conditional logic code in dedicated utilities
2. Create a small, focused React context for form state if needed
3. Use composition and the Strategy pattern for different operators/actions
4. Keep export logic in separate utility modules
5. Unit test logic evaluation separately from UI components

## 7. Development Phases

1. **Phase 1**: Data structure and core evaluation logic
2. **Phase 2**: Field edit UI for setting up conditions
3. **Phase 3**: Preview/runtime conditional behavior
4. **Phase 4**: Export format implementations
5. **Phase 5**: Performance optimization

## 8. Testing Strategy

- Unit tests for the evaluation logic
- Component tests for the UI
- End-to-end tests for full form behavior
- Export validation tests

## Conclusion

This approach allows us to implement powerful conditional logic in our form builder without compromising on performance or code quality. By isolating the logic in dedicated utilities and using a clean data structure, we can support complex conditions while keeping the codebase manageable.

The conditional logic system is designed to be:
- Extensible (new operators, new actions)
- Performant (minimal re-renders, efficient evaluation)
- User-friendly (intuitive UI)
- Export-compatible (works in all formats)

This implementation should provide a solid foundation for adding conditional logic to our form builder without bloating the codebase.
