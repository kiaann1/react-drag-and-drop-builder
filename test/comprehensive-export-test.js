// Comprehensive test of all export utilities with wizard support
import { exportAsJson } from '../src/utils/exportJson.js';
import { exportFormAsCsv } from '../src/utils/exportCsv.js';
import { exportAsHtml } from '../src/utils/exportHtml.js';
import { exportAsReactComponent } from '../src/utils/exportReactComponent.js';
import { exportAsTypescriptComponent } from '../src/utils/exportTypescriptComponent.js';
import { exportAsCf7 } from '../src/utils/exportCf7.js';

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
    type: 'select',
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' }
    ],
    required: true
  }
];

const mockFormOptions = {
  formTitle: 'Test Wizard Form',
  submitButtonText: 'Complete Registration',
  backgroundColor: '#ffffff',
  textColor: '#333333'
};

// Helper for HTML export
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

console.log('🧪 COMPREHENSIVE WIZARD EXPORT TESTS\n');
console.log('=' .repeat(50));

const testResults = [];

// Test JSON Export
try {
  console.log('\n📄 Testing JSON Export...');
  const jsonResult = exportAsJson(mockWizardFormElements, 'Test Wizard Form', mockFormOptions);
  const parsed = JSON.parse(jsonResult);
  const jsonTest = {
    format: 'JSON',
    success: true,
    wizardDetected: parsed.isWizard,
    stepCount: parsed.wizardSteps?.length || 0,
    size: jsonResult.length
  };
  testResults.push(jsonTest);
  console.log(`   ✅ Wizard: ${jsonTest.wizardDetected}, Steps: ${jsonTest.stepCount}, Size: ${jsonTest.size}b`);
} catch (error) {
  testResults.push({ format: 'JSON', success: false, error: error.message });
  console.log(`   ❌ Failed: ${error.message}`);
}

// Test CSV Export
try {
  console.log('\n📊 Testing CSV Export...');
  const csvResult = exportFormAsCsv(mockWizardFormElements, 'Test Wizard Form', mockFormOptions);
  const hasWizardColumns = csvResult.includes('Wizard Step') && csvResult.includes('Step Title');
  const csvTest = {
    format: 'CSV',
    success: true,
    wizardSupport: hasWizardColumns,
    size: csvResult.length
  };
  testResults.push(csvTest);
  console.log(`   ✅ Wizard Support: ${csvTest.wizardSupport}, Size: ${csvTest.size}b`);
} catch (error) {
  testResults.push({ format: 'CSV', success: false, error: error.message });
  console.log(`   ❌ Failed: ${error.message}`);
}

// Test HTML Export
try {
  console.log('\n🌐 Testing HTML Export...');
  const htmlResult = exportAsHtml(mockWizardFormElements, 'Test Wizard Form', mockFormOptions, hexToRgb);
  const hasWizardFeatures = htmlResult.includes('wizard-prev') && htmlResult.includes('currentStep');
  const htmlTest = {
    format: 'HTML',
    success: true,
    wizardUI: hasWizardFeatures,
    size: htmlResult.length
  };
  testResults.push(htmlTest);
  console.log(`   ✅ Wizard UI: ${htmlTest.wizardUI}, Size: ${htmlTest.size}b`);
} catch (error) {
  testResults.push({ format: 'HTML', success: false, error: error.message });
  console.log(`   ❌ Failed: ${error.message}`);
}

// Test React Component Export
try {
  console.log('\n⚛️ Testing React Component Export...');
  const reactResult = exportAsReactComponent(mockWizardFormElements, 'TestWizardForm', mockFormOptions);
  const hasWizardLogic = reactResult.includes('currentStep') && reactResult.includes('setCurrentStep');
  const reactTest = {
    format: 'React',
    success: true,
    wizardLogic: hasWizardLogic,
    size: reactResult.length
  };
  testResults.push(reactTest);
  console.log(`   ✅ Wizard Logic: ${reactTest.wizardLogic}, Size: ${reactTest.size}b`);
} catch (error) {
  testResults.push({ format: 'React', success: false, error: error.message });
  console.log(`   ❌ Failed: ${error.message}`);
}

// Test TypeScript Component Export
try {
  console.log('\n🔷 Testing TypeScript Component Export...');
  const tsResult = exportAsTypescriptComponent(mockWizardFormElements, 'TestWizardForm', mockFormOptions);
  const hasWizardLogic = tsResult.includes('currentStep') && tsResult.includes('setCurrentStep');
  const hasTypeScript = tsResult.includes('interface') && tsResult.includes(': React.FC');
  const tsTest = {
    format: 'TypeScript',
    success: true,
    wizardLogic: hasWizardLogic,
    typescript: hasTypeScript,
    size: tsResult.length
  };
  testResults.push(tsTest);
  console.log(`   ✅ Wizard Logic: ${tsTest.wizardLogic}, TypeScript: ${tsTest.typescript}, Size: ${tsTest.size}b`);
} catch (error) {
  testResults.push({ format: 'TypeScript', success: false, error: error.message });
  console.log(`   ❌ Failed: ${error.message}`);
}

// Test Contact Form 7 Export
try {
  console.log('\n📝 Testing Contact Form 7 Export...');
  const cf7Result = exportAsCf7(mockWizardFormElements, mockFormOptions);
  const hasMultiStep = cf7Result.includes('Multi-Step') && cf7Result.includes('Step 1:');
  const cf7Test = {
    format: 'Contact Form 7',
    success: true,
    multiStep: hasMultiStep,
    size: cf7Result.length
  };
  testResults.push(cf7Test);
  console.log(`   ✅ Multi-step: ${cf7Test.multiStep}, Size: ${cf7Test.size}b`);
} catch (error) {
  testResults.push({ format: 'Contact Form 7', success: false, error: error.message });
  console.log(`   ❌ Failed: ${error.message}`);
}

// Summary
console.log('\n' + '=' .repeat(50));
console.log('📊 TEST SUMMARY');
console.log('=' .repeat(50));

const successfulTests = testResults.filter(t => t.success);
const failedTests = testResults.filter(t => !t.success);

console.log(`✅ Successful: ${successfulTests.length}/${testResults.length}`);
console.log(`❌ Failed: ${failedTests.length}/${testResults.length}`);

if (successfulTests.length > 0) {
  console.log('\n🎉 Working Export Formats:');
  successfulTests.forEach(test => {
    console.log(`   • ${test.format}`);
  });
}

if (failedTests.length > 0) {
  console.log('\n⚠️  Failed Export Formats:');
  failedTests.forEach(test => {
    console.log(`   • ${test.format}: ${test.error}`);
  });
}

console.log('\n🎯 Wizard Feature Support:');
const wizardSupport = successfulTests.filter(t => 
  t.wizardDetected || t.wizardSupport || t.wizardUI || t.wizardLogic || t.multiStep
);
console.log(`   ${wizardSupport.length}/${successfulTests.length} formats support wizard features`);

console.log('\n🏁 All export tests completed!');
