# Pre-Deployment Check

Validate the portfolio is ready for deployment to production.

## Checks to Perform

### 1. HTML Validation
- Check all HTML files for proper structure
- Verify all tags are closed
- Check for duplicate IDs
- Validate semantic HTML usage

### 2. Link Verification
- Check all internal links (href) resolve to existing files
- Verify anchor links (#section) have matching IDs
- Check external links are using https://
- Verify email links use proper mailto: format

### 3. Image Optimization
- Check all images have `alt` attributes
- Verify images use `loading="lazy"` where appropriate
- Check for oversized images (>500KB)
- Confirm image paths are correct

### 4. Meta Tags
- Verify each page has unique `<title>`
- Check `<meta name="description">` exists and is meaningful
- Verify Open Graph tags (og:title, og:description, og:image)
- Check favicon is linked

### 5. Accessibility
- Verify ARIA labels on interactive elements
- Check color contrast (reference CSS variables)
- Verify skip links exist
- Check form labels are associated

### 6. Performance Indicators
- Check for render-blocking resources
- Verify critical CSS is inlined or preloaded
- Check script loading (defer/async where appropriate)

### 7. Security
- No hardcoded API keys or secrets
- External scripts use integrity attributes where available
- No mixed content (http:// resources on https:// page)

## Output Format

```
## Deployment Readiness Report

### Critical Issues (must fix)
- [ ] Issue 1 - file:line
- [ ] Issue 2 - file:line

### Warnings (should fix)
- [ ] Warning 1
- [ ] Warning 2

### Passed Checks
- HTML validation
- Image optimization
- ...

### Recommendation
READY / NOT READY for deployment
```

## Post-Check

If issues found, offer to fix automatically where possible (alt text, lazy loading, etc.)
