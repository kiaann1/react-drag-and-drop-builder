# CSV/Excel Export Implementation

## Overview
This implementation adds secure CSV and Excel export functionality to prevent injection/XSS attacks as requested in the security todo list.

## Features Added

### 1. CSV Export (`exportCsv.js`)
- **Formula Injection Prevention**: Prefixes cells starting with `=`, `+`, `-`, `@` with a single quote
- **XSS Sanitization**: HTML entities are escaped using the existing `sanitizeHtml` function  
- **Data Validation**: Validates export data for suspicious patterns before download
- **Safe Filenames**: Generates secure filenames with timestamp
- **UTF-8 BOM**: Includes BOM for proper Excel compatibility

### 2. Excel Export (`exportExcel.js`)
- **XLSX Library Integration**: Uses SheetJS library for native Excel file creation
- **Injection Prevention**: Same formula injection prevention as CSV
- **Cell Limits**: Respects Excel's 32,767 character cell limit
- **Worksheet Names**: Creates safe worksheet names following Excel restrictions
- **Fallback Support**: Falls back to CSV format if XLSX library unavailable

### 3. Enhanced Security (`security.js`)
- **Export-Specific Sanitization**: `sanitizeForExport()` function for CSV/Excel formats
- **Content Validation**: `validateExportData()` checks for dangerous patterns
- **Rate Limiting**: Export-specific rate limiter (5 exports per minute)
- **Token Generation**: Export tokens for secure downloads

### 4. UI Integration (`SaveFormModal.jsx`)
- **New Export Formats**: Added CSV and Excel options to export dropdown
- **Download Button**: Separate download button for file-based exports
- **Loading States**: Shows spinner during export processing
- **Error Handling**: Displays export validation errors to user
- **Rate Limiting**: Prevents spam export attempts

## Security Measures

### Formula Injection Prevention
```javascript
// Dangerous patterns that could execute as formulas
if (sanitized.match(/^[=+\-@]/)) {
  sanitized = "'" + sanitized; // Force text interpretation
}
```

### XSS Prevention
```javascript
// Multiple layers of sanitization
sanitized = sanitizeHtml(sanitized); // HTML entity encoding
sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, ''); // Remove control chars
```

### Content Validation
```javascript
const suspiciousPatterns = [
  /^[=+\-@]/m,     // Formula injection
  /<script/i,      // Script tags  
  /javascript:/i,  // JavaScript URLs
  /vbscript:/i,    // VBScript URLs
  /data:.*base64/i // Data URLs
];
```

## Installation Requirements

To use Excel export functionality, install the xlsx library:

```bash
npm install xlsx
```

The application will gracefully fall back to CSV format if xlsx is not available.

## Usage

### Export Form Structure
```javascript
import { exportFormAsCsv, downloadCsv } from './utils/exportCsv';
import { exportFormAsExcel } from './utils/exportExcel';

// CSV export
const csvContent = exportFormAsCsv(formElements, formName, formOptions);
downloadCsv(csvContent, 'form_export.csv');

// Excel export  
await exportFormAsExcel(formElements, formName, formOptions);
```

### Export Form Submissions
```javascript
import { exportSubmissionsAsCsv, exportSubmissionsAsExcel } from './utils/exportCsv';

// Export user submissions
const csvContent = exportSubmissionsAsCsv(submissions, formElements, formName);
await exportSubmissionsAsExcel(submissions, formElements, formName);
```

## Validation

All exports are validated before processing:

```javascript
const validation = validateExportData(data, format);
if (!validation.isValid) {
  throw new Error(`Export failed: ${validation.errors.join(', ')}`);
}
```

## Rate Limiting

Export operations are rate-limited to prevent abuse:
- Maximum 5 exports per minute per user
- Configurable time window and request limits
- Client-side enforcement with server-side backup recommended

## File Security

### Safe Filenames
- Special characters removed or replaced
- Length limited to 50 characters
- Timestamp added for uniqueness
- Proper file extensions

### Content Restrictions
- Cell content limited to Excel's 32,767 character limit
- Total rows limited to Excel's 1,048,576 row limit
- Suspicious patterns detected and blocked
- UTF-8 encoding with BOM for compatibility

## Testing

To test the implementation:

1. Create a form with various field types
2. Add content that might trigger injection (=CALC, +dangerous, etc.)
3. Export as CSV and Excel
4. Verify content is properly escaped in spreadsheet applications
5. Test rate limiting by attempting multiple rapid exports

## Future Enhancements

- Server-side export processing for large datasets
- Additional export formats (ODS, PDF)
- Advanced sanitization rules
- Export audit logging
- Encrypted export files for sensitive data

## Compliance

This implementation helps address several security requirements:
- ✅ Sanitize export data to prevent injection/XSS in CSV, Excel, etc.
- ✅ Rate limiting for export operations
- ✅ Input validation and sanitization
- ✅ Content Security Policy compliance
- ✅ XSS prevention measures
