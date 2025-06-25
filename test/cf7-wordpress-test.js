// Create a simpler CF7 export that works better with WordPress
import { exportAsCf7 } from '../src/utils/exportCf7.js';

// Test with the same structure as your form
const testFormElements = [
  {
    id: 'field-1',
    type: 'text',
    label: 'Text',
    placeholder: 'Text',
    required: false
  },
  {
    id: 'field-2',
    type: 'email', 
    label: 'Email',
    placeholder: 'Email',
    required: false
  },
  {
    id: 'page-break-1',
    type: 'pageBreak',
    label: 'Step 1',
    helpText: ''
  },
  {
    id: 'field-3',
    type: 'text',
    label: 'Text',
    placeholder: 'Text',
    required: false
  }
];

const formOptions = {
  submitButtonText: 'Send',
  formTitle: 'Test Form'
};

console.log('🧪 Testing WordPress-Compatible CF7 Export\n');

const result = exportAsCf7(testFormElements, formOptions);
console.log('Generated CF7 Code:');
console.log('='.repeat(80));
console.log(result);
console.log('='.repeat(80));
