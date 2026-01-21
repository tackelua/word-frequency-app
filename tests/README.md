# Word Frequency App - Automated Tests

## 📋 Overview

Automated test suite for Phase 5 verification using Playwright.

## 🚀 Quick Start

### Installation

```bash
cd tests
npm install
```

### Run Tests

```bash
# Run with visible browser
npm test

# Run headless (for CI/CD)
npm run test:headless

# Run with debug mode
npm run test:debug
```

## 📁 Structure

```
tests/
├── phase5-verification.js    # Main test runner
├── helpers/
│   ├── page-objects.js       # Page Object Model classes
│   └── test-data.js          # Sample test data
├── screenshots/              # Auto-generated screenshots
├── fixtures/                 # Test files (PDF, DOCX, etc.)
├── package.json
└── README.md
```

## 🧪 Test Cases

### Automated Tests

1. **Login Success Toast** - Verifies checkmark icon on successful login
2. **Table Header Color** - Checks #131625 color implementation
3. **Feedback Multi-File Upload** - Verifies multiple file support
4. **Menu Dropdown** - Checks if logout replaced with menu
5. **Professional Footer** - Verifies footer content
6. **File Upload** - Tests basic upload functionality
7. **Page Performance** - Measures load time
8. **Responsive Design** - Tests mobile viewport

## 📸 Screenshots

All screenshots are automatically saved to `tests/screenshots/` with timestamps.

## 🔧 Configuration

Edit `CONFIG` object in `phase5-verification.js`:

```javascript
const CONFIG = {
  baseURL: 'http://localhost:3000',
  screenshotDir: path.join(__dirname, 'screenshots'),
  timeout: 30000,
  testEmail: 'test@example.com'
};
```

## 📊 Test Results

After running tests, you'll see a summary:

```
========================================
Test Summary
========================================
Total Duration: 15.23s
Passed: 12
Failed: 0

✓ Passed Tests:
  - Page Load Performance
  - Login UI Elements
  - Table Header Color CSS
  - Feedback file input has multiple attribute
  ...

Screenshots saved to: /path/to/screenshots
========================================
```

## 🎯 Usage with Page Objects

```javascript
const { HomePage, LoginModal, Toast } = require('./helpers/page-objects');

// In your test
const homePage = new HomePage(page);
await homePage.navigate('http://localhost:3000');
await homePage.clickLogin();

const loginModal = new LoginModal(page);
await loginModal.enterEmail('test@example.com');
await loginModal.clickSendOtp();

const toast = new Toast(page);
await toast.waitForToast();
const type = await toast.getType();
// type === 'success' ✓
```

## 🐛 Debugging

- Screenshots are taken at key points
- Run with `DEBUG=true` for verbose logging
- Use `slowMo: 100` in browser launch for visual debugging
- Set `headless: false` to watch tests execute

## 📝 Adding New Tests

1. Create test function in `phase5-verification.js`:

```javascript
async function testMyFeature(page) {
  log('Testing My Feature...', 'INFO');
  
  try {
    // Your test logic
    await page.click('#myButton');
    const result = await page.textContent('#result');
    assertEqual(result, 'Expected', 'My Feature Test');
  } catch (error) {
    log(`Test failed: ${error.message}`, 'FAIL');
    results.failed.push({ test: 'My Feature', error: error.message });
  }
}
```

2. Add to `runTests()`:

```javascript
await testMyFeature(page);
```

## 🔄 CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Run E2E Tests
  run: |
    npm run dev &
    sleep 5
    cd tests
    npm install
    npm run test:headless
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

## ⚠️ Prerequisites

- Server must be running at `http://localhost:3000`
- Start with: `npm run dev` in project root
- Ensure all dependencies installed

## 🤝 Contributing

When adding tests:
- Follow existing naming conventions
- Add appropriate logging
- Take screenshots at key points
- Update this README
