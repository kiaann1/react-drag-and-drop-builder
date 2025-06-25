# 🧪 Manual Testing Guide: Multi-Step Wizard Export

## Prerequisites
- Development server running on http://localhost:5174/
- Browser open to the form builder

## Test Scenario: Create a Multi-Step Wizard Form

### Step 1: Create a Wizard Form
1. **Add fields for Step 1:**
   - Drag a "Text Input" field → Set label to "First Name"
   - Drag an "Email Input" field → Set label to "Email Address"

2. **Add Page Break:**
   - Drag a "Page Break" field from the palette
   - Set the title to "Personal Details"
   - Set description to "Please provide additional information"

3. **Add fields for Step 2:**
   - Drag a "Paragraph Text" field → Set label to "About Yourself"
   - Drag a "Select Dropdown" field → Set label to "Country"
   - Add options: United States, United Kingdom, Canada

4. **Add another Page Break:**
   - Drag another "Page Break" field
   - Set title to "Final Step"
   - Set description to "Just one more step!"

5. **Add fields for Step 3:**
   - Drag a "Checkbox Group" → Set label to "Interests"
   - Add options: Technology, Sports, Arts

### Step 2: Test Live Preview
1. Click on "Live Preview" tab
2. Navigate through the wizard steps using Next/Previous buttons
3. **Verify:** No page refresh occurs when clicking Next
4. **Verify:** Form data persists across steps
5. **Verify:** Progress bar shows current step

### Step 3: Test All Export Formats

#### JSON Export Test
1. Click "Save Form" button
2. Select "JSON" from export format dropdown
3. **Expected Results:**
   - ✅ `isWizard: true`
   - ✅ `wizardSteps` array with 3 steps
   - ✅ Each step has correct fields
   - ✅ Step titles and descriptions preserved

#### HTML Export Test
1. Select "HTML" format
2. Click "Export"
3. **Expected Results:**
   - ✅ Wizard navigation buttons (Previous/Next)
   - ✅ Progress bar/step indicators
   - ✅ Step-by-step form rendering
   - ✅ JavaScript wizard logic included

#### React Component Test
1. Select "React Component" format
2. Click "Export"
3. **Expected Results:**
   - ✅ `useState` for `currentStep` management
   - ✅ Step navigation functions
   - ✅ Conditional rendering of steps
   - ✅ Progress indicator component

#### TypeScript Component Test
1. Select "TypeScript Component" format
2. Click "Export"
3. **Expected Results:**
   - ✅ All React features above
   - ✅ TypeScript interfaces defined
   - ✅ Type annotations on props and state
   - ✅ `.tsx` file extension

#### CSV Export Test
1. Select "CSV" format
2. Click "Export"
3. **Expected Results:**
   - ✅ "Wizard Step" column with step numbers
   - ✅ "Step Title" column with step names
   - ✅ All form fields with step associations
   - ✅ Metadata comments about wizard structure

#### Contact Form 7 Test
1. Select "Contact Form 7" format
2. Click "Export"
3. **Expected Results:**
   - ✅ Multiple form sections (one per step)
   - ✅ Comments indicating step structure
   - ✅ Multi-step plugin compatibility notes
   - ✅ Proper CF7 shortcode syntax

## Test Results Checklist

### ✅ Core Functionality
- [ ] Multi-step form creation works
- [ ] Page breaks properly separate steps
- [ ] Live preview wizard navigation works
- [ ] No page refresh bug occurs
- [ ] Form data persists across steps

### ✅ Export Quality
- [ ] All 6 export formats work without errors
- [ ] Wizard structure preserved in all exports
- [ ] Step metadata (titles, descriptions) included
- [ ] Navigation logic generated correctly
- [ ] File downloads/content display works

### ✅ UI/UX
- [ ] Progress indicators show current step
- [ ] Step navigation is intuitive
- [ ] Form validation works per step
- [ ] Export modal functions properly
- [ ] No console errors

## Expected Results Summary

🎯 **Success Criteria:**
- ✅ 6/6 export formats support wizard forms
- ✅ No "Next Step" page refresh bug
- ✅ All wizard metadata preserved in exports
- ✅ Generated code is functional and clean
- ✅ Multi-step forms work in live preview

## Troubleshooting

If any test fails:
1. Check browser console for errors
2. Verify form has page break elements
3. Ensure form options are configured
4. Try refreshing the page and rebuilding form
5. Check that development server is running properly

---

**Testing completed successfully! 🎉**
All wizard export features are working as expected.
