import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import StarRating from './StarRating';

const countryList = [
  { value: '', label: 'Select a country' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AU', label: 'Australia' },
];

const PreviewModal = ({ isOpen, onClose, formElements }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [submittedData, setSubmittedData] = useState(null);
  const [colorValues, setColorValues] = useState({});
  const [rangeValues, setRangeValues] = useState({});
  const [ratingValues, setRatingValues] = useState({});

  // Reset form and all dynamic values when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
      setSubmittedData(null);
      setColorValues({});
      setRangeValues({});
      setRatingValues({});
    }
  }, [isOpen, formElements, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    // Include all dynamic values in submission
    const finalData = {
      ...data,
      ...colorValues,
      ...rangeValues,
      ...ratingValues,
    };
    setSubmittedData(finalData);
    console.log('Form submitted:', finalData);
  };

  // Main render switch for elements
  const renderFormElement = (element) => {
    // Add safety check for undefined elements
    if (!element || !element.type) {
      return null;
    }

    // Get field styling classes (same as LivePreview)
    const getFieldClasses = () => {
      let classes = "border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
      
      switch (element.size) {
        case 'small':
          classes += " p-2 text-sm";
          break;
        case 'large':
          classes += " p-4 text-lg";
          break;
        default:
          classes += " p-3";
      }

      if (element.customClass) {
        classes += ` ${element.customClass}`;
      }

      return classes;
    };

    // Get container width classes (same as LivePreview)
    const getContainerClasses = () => {
      const width = element.width || 'full';
      switch (width) {
        case 'half':
          return "w-1/2 pr-2 inline-block align-top";
        case 'third':
          return "w-1/3 pr-2 inline-block align-top";
        case 'quarter':
          return "w-1/4 pr-2 inline-block align-top";
        default:
          return "w-full";
      }
    };

    // Get default options (same as LivePreview)
    const getElementOptions = () => {
      if (element.options && element.options.length > 0) {
        return element.options;
      }
      switch (element.type) {
        case 'select':
        case 'radio':
        case 'checkbox':
        case 'multiselect':
          return [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ];
        default:
          return [];
      }
    };

    const fieldProps = {
      ...register(element.id, { 
        required: element.required ? `${element.label} is required` : false 
      }),
      disabled: element.disabled,
      defaultValue: element.defaultValue,
    };

    // Copy ALL cases from LivePreview exactly, but with form integration
    switch (element.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'name':
      case 'firstName':
      case 'lastName':
      case 'company':
      case 'jobTitle':
      case 'address':
      case 'city':
      case 'zipCode':
      case 'website':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <input
              type={element.type === 'name' || element.type === 'firstName' || element.type === 'lastName' || element.type === 'company' || element.type === 'jobTitle' || element.type === 'address' || element.type === 'city' || element.type === 'zipCode' ? 'text' : element.type === 'website' ? 'url' : element.type}
              placeholder={element.placeholder}
              className={getFieldClasses()}
              minLength={element.minLength}
              maxLength={element.maxLength}
              pattern={element.pattern}
              {...fieldProps}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'hidden':
        return (
          <input
            key={element.id}
            type="hidden"
            {...fieldProps}
          />
        );

      case 'paragraph':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <textarea
              placeholder={element.placeholder}
              rows={element.size === 'small' ? 2 : element.size === 'large' ? 6 : 4}
              className={getFieldClasses()}
              minLength={element.minLength}
              maxLength={element.maxLength}
              {...fieldProps}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <input
              type="number"
              placeholder={element.placeholder}
              className={getFieldClasses()}
              min={element.min}
              max={element.max}
              step={element.step}
              {...fieldProps}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'rating':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <StarRating 
              value={ratingValues[element.id] || (element.defaultValue ? parseFloat(element.defaultValue) : 0)}
              disabled={element.disabled}
              size="w-8 h-8"
              onChange={(value) => {
                setRatingValues(prev => ({ ...prev, [element.id]: value }));
                setValue(element.id, value);
              }}
            />
            <input
              type="hidden"
              {...register(element.id, { 
                required: element.required ? `Please rate ${element.label}` : false 
              })}
            />
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'range':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              <input
                type="range"
                min={element.min || 0}
                max={element.max || 100}
                step={element.step || 1}
                defaultValue={element.defaultValue || 50}
                onChange={(e) => {
                  setRangeValues(prev => ({ ...prev, [element.id]: e.target.value }));
                  setValue(element.id, e.target.value);
                }}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${element.customClass || ''}`}
                {...register(element.id)}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{element.min || 0}</span>
                <span>Value: {rangeValues[element.id] || element.defaultValue || 50}</span>
                <span>{element.max || 100}</span>
              </div>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'color':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="flex items-center space-x-3">
              <input
                type="color"
                defaultValue={element.defaultValue || '#000000'}
                onChange={(e) => {
                  setColorValues(prev => ({ ...prev, [element.id]: e.target.value }));
                  setValue(element.id, e.target.value);
                }}
                className={`h-12 w-20 border border-gray-300 rounded-md cursor-pointer ${element.customClass || ''}`}
                {...register(element.id)}
              />
              <span className="text-sm text-gray-600">
                Selected: {colorValues[element.id] || element.defaultValue || '#000000'}
              </span>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'select':
        const selectOptions = getElementOptions();
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <select
              className={getFieldClasses()}
              {...fieldProps}
            >
              <option value="">{element.placeholder || 'Select an option'}</option>
              {selectOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'multiselect':
        const multiselectOptions = getElementOptions();
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <select 
              multiple 
              className={`${getFieldClasses()} min-h-[120px]`}
              {...fieldProps}
            >
              {multiselectOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'checkbox':
        const checkboxOptions = getElementOptions();
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              {checkboxOptions.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option.value}
                    className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${element.customClass || ''}`}
                    {...register(element.id, { 
                      required: element.required ? `Please select at least one ${element.label}` : false 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'radio':
        const radioOptions = getElementOptions();
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              {radioOptions.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    className={`border-gray-300 text-blue-600 focus:ring-blue-500 ${element.customClass || ''}`}
                    {...register(element.id, { 
                      required: element.required ? `Please select ${element.label}` : false 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'country':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <select
              className={getFieldClasses()}
              {...fieldProps}
            >
              <option value="">{element.placeholder || 'Select a country'}</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AU">Australia</option>
            </select>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'yesno':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="yes"
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register(element.id, { 
                    required: element.required ? `Please select ${element.label}` : false 
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="no"
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register(element.id)}
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'scale':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Poor</span>
                <span className="text-sm text-gray-600">Excellent</span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <label key={num} className="flex flex-col items-center">
                    <input 
                      type="radio" 
                      value={num}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...register(element.id, { 
                        required: element.required ? `Please rate ${element.label}` : false 
                      })}
                    />
                    <span className="text-xs text-gray-600 mt-1">{num}</span>
                  </label>
                ))}
              </div>
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      case 'likert':
        return (
          <div key={element.id} className={`mb-4 ${getContainerClasses()}`}>
            {!element.hideLabel && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
                <label key={index} className="flex items-center">
                  <input 
                    type="radio" 
                    value={option}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register(element.id, { 
                      required: element.required ? `Please select ${element.label}` : false 
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {element.helpText && (
              <p className="mt-1 text-sm text-gray-500">{element.helpText}</p>
            )}
            {errors[element.id] && (
              <p className="mt-1 text-sm text-red-600">{errors[element.id].message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Filter valid elements and force re-render when they change
  const validElements = formElements.filter(element => element && element.id && element.type);

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Form Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content - Exact same structure as LivePreview */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] bg-white">
          {submittedData ? (
            <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-800 mb-3">Form Submitted Successfully!</h3>
                <div className="text-sm text-green-700">
                  <pre className="whitespace-pre-wrap bg-green-100 p-3 rounded">
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                </div>
                <button
                  onClick={() => {
                    setSubmittedData(null);
                    reset();
                    setColorValues({});
                    setRangeValues({});
                    setRatingValues({});
                  }}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {validElements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Form Preview</h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    Add fields to see how your form will look
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {validElements.map(renderFormElement)}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                    >
                      Submit Form
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;