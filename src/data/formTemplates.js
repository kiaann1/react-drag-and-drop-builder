// Form templates data
export const formTemplates = [
  {
    id: 'simple-contact',
    name: 'Simple Contact Form',
    description: 'Basic contact form with essential fields',
    category: 'Contact',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email address',
        required: true,
        width: 'full'
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: false,
        width: 'full'
      },
      {
        id: 'message',
        type: 'message',
        label: 'Message',
        placeholder: 'Enter your message',
        required: true,
        width: 'full'
      }
    ]
  },
  {
    id: 'multi-step-contact',
    name: 'Multi-Step Contact Form',
    description: 'Two-step contact form with additional details',
    category: 'Contact',
    fields: [
      // Step 1
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email address',
        required: true,
        width: 'full'
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: false,
        width: 'full'
      },
      {
        id: 'message',
        type: 'message',
        label: 'Message',
        placeholder: 'Enter your message',
        required: true,
        width: 'full'
      },
      // Page Break
      {
        id: 'page-break-1',
        type: 'pageBreak',
        label: 'Additional Details',
        helpText: 'Please provide some additional information'
      },
      // Step 2
      {
        id: 'country',
        type: 'select',
        label: 'Country',
        placeholder: 'Select your country',
        required: true,
        width: 'full',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
          { value: 'au', label: 'Australia' },
          { value: 'de', label: 'Germany' },
          { value: 'fr', label: 'France' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'country-other',
        type: 'text',
        label: 'Please specify your country',
        placeholder: 'Enter your country name',
        required: true,
        width: 'full',
        helpText: 'Please specify which country you are from',
        conditionalLogic: {
          active: true,
          action: 'show',
          rules: [
            {
              field: 'country',
              operator: 'equals',
              value: 'other'
            }
          ],
          combinator: 'AND'
        }
      },
      {
        id: 'file-upload',
        type: 'file',
        label: 'File Upload',
        placeholder: 'Upload a file',
        required: false,
        width: 'full',
        helpText: 'Upload any relevant documents'
      },
      {
        id: 'terms',
        type: 'checkbox',
        label: 'Terms & Conditions',
        required: true,
        width: 'full',
        options: [
          { value: 'agree', label: 'I agree to the terms and conditions' }
        ]
      }
    ]
  },
  {
    id: 'job-application',
    name: 'Job Application Form',
    description: 'Comprehensive job application with file uploads',
    category: 'Employment',
    fields: [
      {
        id: 'full-name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email address',
        required: true,
        width: 'full'
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: true,
        width: 'full'
      },
      {
        id: 'github-url',
        type: 'website',
        label: 'GitHub URL',
        placeholder: 'https://github.com/yourusername',
        required: false,
        width: 'full',
        helpText: 'Link to your GitHub profile (optional)'
      },
      {
        id: 'cv-upload',
        type: 'file',
        label: 'CV Upload',
        placeholder: 'Upload your CV',
        required: true,
        width: 'full',
        helpText: 'Upload your CV in PDF or DOCX format',
        accept: '.pdf,.docx,.doc'
      },
      {
        id: 'cover-letter',
        type: 'file',
        label: 'Cover Letter Upload',
        placeholder: 'Upload your cover letter',
        required: false,
        width: 'full',
        helpText: 'Upload your cover letter in PDF or DOCX format',
        accept: '.pdf,.docx,.doc'
      },
      {
        id: 'salary-expectation',
        type: 'number',
        label: 'Salary Expectation',
        placeholder: 'Enter expected salary',
        required: false,
        width: 'full',
        helpText: 'Annual salary expectation in USD'
      },
      {
        id: 'start-date',
        type: 'date',
        label: 'Available Start Date',
        placeholder: 'Select start date',
        required: true,
        width: 'full',
        helpText: 'When can you start working?'
      },
      {
        id: 'contact-agreement',
        type: 'checkbox',
        label: 'Contact Permission',
        required: true,
        width: 'full',
        options: [
          { value: 'agree', label: 'I agree to be contacted about this position' }
        ]
      },
      {
        id: 'terms-conditions',
        type: 'checkbox',
        label: 'Terms & Conditions',
        required: true,
        width: 'full',
        options: [
          { value: 'agree', label: 'I agree to the terms and conditions' }
        ]
      }
    ]
  },
  {
    id: 'event-registration',
    name: 'Event Registration Form',
    description: 'Complete event registration with participant details',
    category: 'Registration',
    fields: [
      {
        id: 'participant-name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        id: 'participant-email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        width: 'full'
      },
      {
        id: 'participant-phone',
        type: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: true,
        width: 'full'
      },
      {
        id: 'company-org',
        type: 'company',
        label: 'Company/Organization',
        placeholder: 'Enter your company name',
        required: false,
        width: 'full'
      },
      {
        id: 'job-title-reg',
        type: 'jobTitle',
        label: 'Job Title',
        placeholder: 'Enter your job title',
        required: false,
        width: 'full'
      },
      {
        id: 'event-sessions',
        type: 'multiselect',
        label: 'Sessions to Attend',
        placeholder: 'Select sessions',
        required: true,
        width: 'full',
        options: [
          { value: 'keynote', label: 'Keynote Presentation' },
          { value: 'workshop1', label: 'Morning Workshop' },
          { value: 'workshop2', label: 'Afternoon Workshop' },
          { value: 'panel', label: 'Panel Discussion' },
          { value: 'networking', label: 'Networking Session' }
        ]
      },
      {
        id: 'dietary-requirements',
        type: 'select',
        label: 'Dietary Requirements',
        placeholder: 'Select dietary needs',
        required: false,
        width: 'full',
        options: [
          { value: 'none', label: 'No special requirements' },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'vegan', label: 'Vegan' },
          { value: 'gluten-free', label: 'Gluten-free' },
          { value: 'other', label: 'Other (please specify)' }
        ]
      },
      {
        id: 'dietary-other',
        type: 'text',
        label: 'Please specify dietary requirements',
        placeholder: 'Describe your dietary needs',
        required: true,
        width: 'full',
        conditionalLogic: {
          active: true,
          action: 'show',
          rules: [
            {
              field: 'dietary-requirements',
              operator: 'equals',
              value: 'other'
            }
          ],
          combinator: 'AND'
        }
      },
      {
        id: 'accessibility-needs',
        type: 'message',
        label: 'Accessibility Needs',
        placeholder: 'Please describe any accessibility requirements',
        required: false,
        width: 'full',
        helpText: 'Help us ensure you have the best experience at our event'
      }
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Form',
    description: 'Comprehensive customer satisfaction survey',
    category: 'Survey',
    fields: [
      {
        id: 'customer-name',
        type: 'text',
        label: 'Name (Optional)',
        placeholder: 'Enter your name',
        required: false,
        width: 'full'
      },
      {
        id: 'customer-email',
        type: 'email',
        label: 'Email (Optional)',
        placeholder: 'Enter your email',
        required: false,
        width: 'full',
        helpText: 'We may contact you to follow up on your feedback'
      },
      {
        id: 'service-rating',
        type: 'rating',
        label: 'Overall Service Rating',
        required: true,
        width: 'full',
        helpText: 'Rate your overall experience with our service'
      },
      {
        id: 'product-satisfaction',
        type: 'scale',
        label: 'Product Satisfaction',
        required: true,
        width: 'full',
        helpText: 'How satisfied are you with our product? (1-10 scale)'
      },
      {
        id: 'recommend-service',
        type: 'yesno',
        label: 'Would you recommend our service to others?',
        required: true,
        width: 'full'
      },
      {
        id: 'service-aspects',
        type: 'multiselect',
        label: 'Which aspects of our service did you like most?',
        placeholder: 'Select all that apply',
        required: false,
        width: 'full',
        options: [
          { value: 'quality', label: 'Product Quality' },
          { value: 'support', label: 'Customer Support' },
          { value: 'pricing', label: 'Pricing' },
          { value: 'delivery', label: 'Delivery Speed' },
          { value: 'website', label: 'Website Experience' },
          { value: 'communication', label: 'Communication' }
        ]
      },
      {
        id: 'improvement-suggestions',
        type: 'message',
        label: 'Suggestions for Improvement',
        placeholder: 'What could we do better?',
        required: false,
        width: 'full'
      },
      {
        id: 'additional-comments',
        type: 'message',
        label: 'Additional Comments',
        placeholder: 'Any other feedback you\'d like to share?',
        required: false,
        width: 'full'
      }
    ]
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup Form',
    description: 'Simple newsletter subscription with preferences',
    category: 'Registration',
    fields: [
      {
        id: 'subscriber-email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
        width: 'full'
      },
      {
        id: 'subscriber-name',
        type: 'text',
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: false,
        width: 'full'
      },
      {
        id: 'content-interests',
        type: 'multiselect',
        label: 'Content Interests',
        placeholder: 'Select topics you\'re interested in',
        required: true,
        width: 'full',
        options: [
          { value: 'tech', label: 'Technology News' },
          { value: 'business', label: 'Business Updates' },
          { value: 'design', label: 'Design Trends' },
          { value: 'marketing', label: 'Marketing Tips' },
          { value: 'tutorials', label: 'Tutorials & Guides' },
          { value: 'events', label: 'Events & Webinars' }
        ]
      },
      {
        id: 'email-frequency',
        type: 'radio',
        label: 'Email Frequency',
        required: true,
        width: 'full',
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly' },
          { value: 'monthly', label: 'Monthly' }
        ]
      },
      {
        id: 'newsletter-consent',
        type: 'checkbox',
        label: 'Consent',
        required: true,
        width: 'full',
        options: [
          { value: 'agree', label: 'I agree to receive marketing emails and can unsubscribe at any time' }
        ]
      }
    ]
  },
  {
    id: 'service-request',
    name: 'Service Request Form',
    description: 'Professional service inquiry and request form',
    category: 'Contact',
    fields: [
      {
        id: 'client-name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        id: 'client-email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        width: 'full'
      },
      {
        id: 'client-phone',
        type: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: true,
        width: 'full'
      },
      {
        id: 'client-company',
        type: 'company',
        label: 'Company Name',
        placeholder: 'Enter your company name',
        required: false,
        width: 'full'
      },
      {
        id: 'service-type',
        type: 'select',
        label: 'Service Type',
        placeholder: 'Select the service you need',
        required: true,
        width: 'full',
        options: [
          { value: 'consulting', label: 'Consulting' },
          { value: 'development', label: 'Web Development' },
          { value: 'design', label: 'Design Services' },
          { value: 'marketing', label: 'Digital Marketing' },
          { value: 'maintenance', label: 'Website Maintenance' },
          { value: 'other', label: 'Other Services' }
        ]
      },
      {
        id: 'service-other',
        type: 'text',
        label: 'Please specify the service',
        placeholder: 'Describe the service you need',
        required: true,
        width: 'full',
        conditionalLogic: {
          active: true,
          action: 'show',
          rules: [
            {
              field: 'service-type',
              operator: 'equals',
              value: 'other'
            }
          ],
          combinator: 'AND'
        }
      },
      {
        id: 'project-budget',
        type: 'select',
        label: 'Project Budget Range',
        placeholder: 'Select your budget range',
        required: false,
        width: 'full',
        options: [
          { value: 'under-5k', label: 'Under $5,000' },
          { value: '5k-10k', label: '$5,000 - $10,000' },
          { value: '10k-25k', label: '$10,000 - $25,000' },
          { value: '25k-50k', label: '$25,000 - $50,000' },
          { value: 'over-50k', label: 'Over $50,000' }
        ]
      },
      {
        id: 'project-timeline',
        type: 'select',
        label: 'Desired Timeline',
        placeholder: 'When do you need this completed?',
        required: false,
        width: 'full',
        options: [
          { value: 'asap', label: 'As soon as possible' },
          { value: '1-month', label: 'Within 1 month' },
          { value: '2-3-months', label: '2-3 months' },
          { value: '3-6-months', label: '3-6 months' },
          { value: 'flexible', label: 'Flexible timeline' }
        ]
      },
      {
        id: 'project-description',
        type: 'message',
        label: 'Project Description',
        placeholder: 'Please describe your project in detail',
        required: true,
        width: 'full',
        helpText: 'The more details you provide, the better we can assist you'
      }
    ]
  },
  {
    id: 'product-order',
    name: 'Product Order Form',
    description: 'Simple product ordering form with customer details',
    category: 'Other',
    fields: [
      {
        id: 'customer-name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        id: 'customer-email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        width: 'full'
      },
      {
        id: 'customer-phone',
        type: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: true,
        width: 'full'
      },
      {
        id: 'product-selection',
        type: 'multiselect',
        label: 'Product Selection',
        placeholder: 'Select products to order',
        required: true,
        width: 'full',
        options: [
          { value: 'product-a', label: 'Product A - $29.99' },
          { value: 'product-b', label: 'Product B - $49.99' },
          { value: 'product-c', label: 'Product C - $79.99' },
          { value: 'product-d', label: 'Product D - $99.99' },
          { value: 'bundle-deal', label: 'Bundle Deal - $199.99' }
        ]
      },
      {
        id: 'quantity',
        type: 'number',
        label: 'Total Quantity',
        placeholder: 'Enter total quantity',
        required: true,
        width: 'full',
        helpText: 'Total number of items you want to order'
      },
      {
        id: 'shipping-address',
        type: 'address',
        label: 'Shipping Address',
        placeholder: 'Enter your shipping address',
        required: true,
        width: 'full'
      },
      {
        id: 'shipping-city',
        type: 'city',
        label: 'City',
        placeholder: 'Enter your city',
        required: true,
        width: 'full'
      },
      {
        id: 'shipping-postal',
        type: 'post code',
        label: 'Postal Code',
        placeholder: 'Enter postal code',
        required: true,
        width: 'full'
      },
      {
        id: 'special-instructions',
        type: 'message',
        label: 'Special Instructions',
        placeholder: 'Any special delivery instructions?',
        required: false,
        width: 'full'
      },
      {
        id: 'order-terms',
        type: 'checkbox',
        label: 'Order Terms',
        required: true,
        width: 'full',
        options: [
          { value: 'agree', label: 'I agree to the terms and conditions and return policy' }
        ]
      }
    ]
  }
];

// Template categories for filtering
export const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'contact', name: 'Contact Forms' },
  { id: 'employment', name: 'Employment' },
  { id: 'survey', name: 'Surveys' },
  { id: 'registration', name: 'Registration' },
  { id: 'other', name: 'Other' }
];

// Helper function to generate unique IDs for template fields
export const generateTemplateFields = (template) => {
  return template.fields.map((field, index) => ({
    ...field,
    id: `${field.id}-${Date.now()}-${index}` // Ensure unique IDs
  }));
};
