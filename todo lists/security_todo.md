# Form Builder Security TODO List

## 1. Cross-Site Scripting (XSS)
- [ ] Sanitize all user input and form field data before rendering in the frontend.
- [ ] Never render raw HTML from user-provided content without strict sanitization.
- [ ] Escape dynamic content in all templates and React components.

## 2. Cross-Site Request Forgery (CSRF)
- [ ] Use CSRF tokens for all form submissions that mutate data.
- [ ] Ensure use of same-site cookies for authentication/session management.

## 3. Data Privacy & Storage
- [ ] Encrypt sensitive data at rest and in transit (enforce HTTPS).
- [ ] Enforce access controls to ensure only authorized users can access form submissions.
- [ ] Document and implement a clear data retention and deletion policy.

## 4. Spam & Abuse Protection
- [ ] Implement CAPTCHA or other anti-bot measures for public forms.
- [ ] Apply rate limiting to form submissions.
- [ ] Validate all inputs both client-side and server-side.

## 5. API & Endpoint Security
- [ ] Authenticate and authorize all API requests.
- [ ] Apply rate limiting to all API endpoints.
- [ ] Validate and sanitize all incoming data on the backend.

## 6. Embedding Security (iFrame/Script Embeds)
- [ ] Set X-Frame-Options or Content-Security-Policy headers for embedded forms.
- [ ] Use `<iframe sandbox="allow-forms allow-scripts">` where possible.
- [ ] Restrict what scripts or styles can be loaded via embeds.

## 7. Form Injection
- [ ] Validate and sanitize all form submission data on the server.
- [ ] Do not trust hidden fields or other client-side only validation.

## 8. Authentication & Authorization
- [ ] Enforce strict user access controls for editing/viewing forms and data.
- [ ] Never expose admin features or private data via embeds.

## 9. Supply Chain Security
- [ ] Regularly update and audit all dependencies (use npm audit, Snyk, etc.).
- [ ] Monitor for and patch any vulnerabilities in third-party packages.

## 10. Configuration and Secrets Management
- [ ] Never expose secrets (API keys, DB credentials) in client-side code or embed scripts.
- [ ] Use environment variables and secure server-side storage for sensitive config.

---