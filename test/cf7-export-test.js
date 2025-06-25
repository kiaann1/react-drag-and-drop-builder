// Test CF7 export with wizard form
import { exportAsCf7 } from '../src/utils/exportCf7.js';

// Test form with page breaks (wizard)
const wizardFormElements = [
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
    helpText: 'Please provide additional information'
  },
  {
    id: 'field-3',
    type: 'text',
    label: 'Phone Number',
    placeholder: 'Enter your phone',
    required: false
  }
];

// Test form without page breaks (single step)
const singleStepForm = [
  {
    id: 'field-1',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter your first name'
  },
  {
    id: 'field-2', 
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email'
  }
];

const formOptions = {
  submitButtonText: 'Send Message',
  formTitle: 'Contact Form'
};

console.log('🧪 Testing CF7 Export\n');

console.log('=== WIZARD FORM TEST ===');
try {
  const wizardResult = exportAsCf7(wizardFormElements, formOptions);
  console.log('✅ Wizard form exported successfully');
  console.log(`📏 Output length: ${wizardResult.length} characters`);
  console.log(`🔍 Contains "Multi-Step": ${wizardResult.includes('Multi-Step')}`);
  console.log(`🔍 Contains "Step 1:": ${wizardResult.includes('Step 1:')}`);
  console.log(`🔍 Contains "Step 2:": ${wizardResult.includes('Step 2:')}`);
  
  console.log('\n📝 Generated CF7 Output:');
  console.log('─'.repeat(60));
  console.log(wizardResult);
  console.log('─'.repeat(60));
} catch (error) {
  console.error('❌ Wizard form failed:', error.message);
}

console.log('\n=== SINGLE STEP FORM TEST ===');
try {
  const singleResult = exportAsCf7(singleStepForm, formOptions);
  console.log('✅ Single step form exported successfully');
  console.log(`📏 Output length: ${singleResult.length} characters`);
  console.log(`🔍 Contains "Multi-Step": ${singleResult.includes('Multi-Step')}`);
  
  console.log('\n📝 Generated CF7 Output:');
  console.log('─'.repeat(60));
  console.log(singleResult);
  console.log('─'.repeat(60));
} catch (error) {
  console.error('❌ Single step form failed:', error.message);
}

console.log('\n🏁 CF7 Export Test Complete!');
