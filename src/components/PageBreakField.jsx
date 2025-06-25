import React, { useMemo } from 'react';

const PageBreakField = ({ element, isBuilder = false }) => {
  if (isBuilder) {
    // In the form builder, show a visual representation
    return (
      <div className="page-break-field border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-4 my-4">
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium">Page Break</span>
        </div>
        {element.label && (
          <div className="text-center mt-2">
            <h3 className="text-lg font-semibold text-gray-800">{element.label}</h3>
            {element.helpText && (
              <p className="text-sm text-gray-600 mt-1">{element.helpText}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // In the live preview, this would be handled by the wizard logic
  // and wouldn't render anything directly
  return null;
};

// Hook to split form elements into steps based on page breaks
export const useWizardSteps = (formElements) => {
  return useMemo(() => {
    if (!formElements || formElements.length === 0) {
      return { steps: [], totalSteps: 0 };
    }

    const steps = [];
    let currentStep = {
      id: 'step-0',
      title: 'Step 1',
      description: '',
      fields: []
    };

    formElements.forEach((element, index) => {
      if (element.type === 'pageBreak') {
        // Complete current step if it has fields
        if (currentStep.fields.length > 0) {
          steps.push(currentStep);
        }
        
        // Start new step
        currentStep = {
          id: `step-${steps.length}`,
          title: element.label || `Step ${steps.length + 2}`,
          description: element.helpText || '',
          fields: []
        };
      } else {
        currentStep.fields.push(element);
      }
    });

    // Add the last step if it has fields
    if (currentStep.fields.length > 0) {
      steps.push(currentStep);
    }

    // If no page breaks found, treat entire form as single step
    if (steps.length === 0 && formElements.length > 0) {
      steps.push({
        id: 'step-0',
        title: 'Form',
        description: '',
        fields: formElements.filter(el => el.type !== 'pageBreak')
      });
    }

    return { 
      steps, 
      totalSteps: steps.length,
      isWizard: steps.length > 1
    };
  }, [formElements]);
};

export default PageBreakField;
