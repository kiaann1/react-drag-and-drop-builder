// Direct test of wizard export functionality
import { exportAsJson } from '../src/utils/exportJson.js';
import { exportFormAsCsv } from '../src/utils/exportCsv.js';

// Mock form elements with wizard steps
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
  },
  {
    id: 'field-4',
    type: 'select',
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' }
    ],
    required: true
  },
  {
    id: 'page-break-2',
    type: 'pageBreak',
    label: 'Final Step',
    helpText: 'Just one more step to complete'
  },
  {
    id: 'field-5',
    type: 'checkbox',
    label: 'Interests',
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'sports', label: 'Sports' },
      { value: 'art', label: 'Art' }
    ],
    required: false
  }
];

const mockFormOptions = {
  formTitle: 'Test Wizard Form',
  submitButtonText: 'Complete Registration',
  backgroundColor: '#ffffff',
  textColor: '#333333'
};

console.log('🧪 Testing JSON Export with Wizard Steps...\n');

try {
  const jsonResult = exportAsJson(mockWizardFormElements, 'Test Wizard Form', mockFormOptions);
  const parsed = JSON.parse(jsonResult);
  
  console.log('✅ JSON Export Results:');
  console.log(`- Form Name: ${parsed.name}`);
  console.log(`- Total Elements: ${parsed.elements.length}`);
  console.log(`- Is Wizard: ${parsed.isWizard}`);
  console.log(`- Number of Steps: ${parsed.wizardSteps?.length || 0}`);
  
  if (parsed.wizardSteps) {
    console.log('\n📋 Wizard Steps:');
    parsed.wizardSteps.forEach((step, index) => {
      console.log(`  Step ${index + 1}: "${step.title}" (${step.fields.length} fields)`);
      console.log(`    Fields: ${step.fields.map(f => f.label).join(', ')}`);
    });
  }
  
  console.log('\n🧪 Testing CSV Export with Wizard Steps...\n');
  
  const csvResult = exportFormAsCsv(mockWizardFormElements, 'Test Wizard Form', mockFormOptions);
  const csvLines = csvResult.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const headers = csvLines[0];
  
  console.log('✅ CSV Export Results:');
  console.log(`- Total CSV Data Lines: ${csvLines.length}`);
  console.log(`- Headers: ${headers}`);
  
  // Check if step information is included
  if (headers.includes('Wizard Step') || headers.includes('Step Title')) {
    console.log('✅ Wizard step information is included in CSV');
  } else {
    console.log('❌ Wizard step information missing from CSV');
  }
  
  // Show first few data rows
  console.log('\n📊 Sample CSV Data:');
  csvLines.slice(1, 4).forEach((line, index) => {
    if (line.trim()) {
      console.log(`  Row ${index + 1}: ${line}`);
    }
  });
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}

console.log('\n🎉 Export wizard tests completed!');
