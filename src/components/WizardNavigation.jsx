import React from 'react';

const WizardNavigation = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  canGoNext = true,
  canGoPrev = true,
  isLastStep = false,
  onSubmit,
  showStepNumbers = true,
  nextButtonText = "Next",
  prevButtonText = "Previous",
  submitButtonText = "Submit"
}) => {
  if (totalSteps <= 1) return null;

  return (
    <div className="wizard-navigation bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Progress Bar */}
      <div className="flex-1 max-w-lg mr-6">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-3">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Step Indicators */}
        {showStepNumbers && (
          <div className="flex justify-between mt-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrev || currentStep === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {prevButtonText}
        </button>
        
        {isLastStep ? (
          <button
            type="submit"
            onClick={onSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            {submitButtonText}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {nextButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;
