// Test HTML export with wizard functionality
import { exportAsHtml } from '../src/utils/exportHtml.js';

const mockWizardFormElements = [
  {
    id: 'field-1',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true
  },
  {
    id: 'field-2', 
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true
  },
  {
    id: 'page-break-1',
    type: 'pageBreak',
    label: 'Personal Details',
    helpText: 'Next we need some personal information'
  },
  {
    id: 'field-3',
    type: 'paragraph',
    label: 'About Yourself',
    placeholder: 'Tell us about yourself',
    required: false
  }
];

const mockFormOptions = {
  formTitle: 'Test Wizard Form',
  submitButtonText: 'Complete Registration',
  backgroundColor: '#ffffff',
  textColor: '#333333'
};

// Helper function to convert hex to RGB (mock)
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

console.log('🧪 Testing HTML Export with Wizard Steps...\n');

try {
  const htmlResult = exportAsHtml(mockWizardFormElements, 'Test Wizard Form', mockFormOptions, hexToRgb);
  
  console.log('✅ HTML Export Results:');
  console.log(`- Generated HTML Length: ${htmlResult.length} characters`);
  
  // Check for wizard-specific features
  const hasStepNavigation = htmlResult.includes('wizard-prev') || htmlResult.includes('wizard-next');
  const hasProgressBar = htmlResult.includes('progress') || htmlResult.includes('step-indicator');
  const hasStepContainers = htmlResult.includes('wizard-step') || htmlResult.includes('step-content');
  
  console.log(`- Has Step Navigation: ${hasStepNavigation ? '✅' : '❌'}`);
  console.log(`- Has Progress Bar: ${hasProgressBar ? '✅' : '❌'}`);
  console.log(`- Has Step Containers: ${hasStepContainers ? '✅' : '❌'}`);
  
  // Look for JavaScript wizard logic
  const hasJavaScript = htmlResult.includes('<script>') && htmlResult.includes('currentStep');
  console.log(`- Has Wizard JavaScript: ${hasJavaScript ? '✅' : '❌'}`);
  
  // Count steps in generated HTML
  const stepMatches = htmlResult.match(/step-\d+/g) || [];
  console.log(`- Number of Steps Detected: ${new Set(stepMatches).size}`);
  
  console.log('\n📝 HTML Structure Preview:');
  const lines = htmlResult.split('\n').slice(0, 10);
  lines.forEach((line, index) => {
    if (line.trim()) {
      console.log(`  ${index + 1}: ${line.trim().substring(0, 80)}${line.trim().length > 80 ? '...' : ''}`);
    }
  });
  
} catch (error) {
  console.error('❌ HTML Export failed:', error.message);
}

console.log('\n🎉 HTML export test completed!');
