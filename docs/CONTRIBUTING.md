# Contributing to Word Frequency Analyzer

Thank you for your interest in contributing! 🎉

## Getting Started

### Prerequisites
- Node.js >= 14.0.0
- Git
- Text editor (VS Code recommended)

### Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/word-frequency-app.git
cd word-frequency-app
```

3. Install dependencies:
```bash
npm install
cd tests && npm install && cd ..
```

4. Create `.env` file:
```bash
cp .env.example .env
# Edit with your credentials
```

5. Start development server:
```bash
npm run dev
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code improvements
- `test/` - Test additions

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update tests if needed

### 3. Test Your Changes

```bash
# Run the app
npm run dev

# Run tests
cd tests
npm test
```

### 4. Commit

```bash
git add .
git commit -m "feat: add new feature"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Code Style

### JavaScript

- Use ES6+ features
- Use `const` and `let`, not `var`
- Use arrow functions where appropriate
- Add semicolons
- Use single quotes for strings
- 2-space indentation

**Good:**
```javascript
const analyzeText = (text) => {
  const words = text.split(' ');
  return words.filter(w => w.length > 3);
};
```

**Bad:**
```javascript
var analyzeText = function(text){
    var words = text.split(" ")
    return words.filter(function(w){return w.length>3})
}
```

### CSS

- Use CSS variables for colors
- Group related properties
- Add comments for sections
- Mobile-first approach

### HTML

- Semantic HTML5 elements
- Accessible attributes (ARIA when needed)
- Proper indentation

---

## Project Structure

```
word-frequency-app/
├── server.js           # Express server
├── src/                # Backend code
│   ├── analyzer.js     # Text analysis
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Express middleware
├── public/             # Frontend
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── tests/              # E2E tests
└── docs/               # Documentation
```

---

## Adding Features

### Backend (API)

1. Create route in `src/routes/`
2. Add business logic
3. Update models if needed
4. Test with curl or Postman
5. Document in `docs/API.md`

### Frontend

1. Update HTML structure
2. Add JavaScript logic to `public/app.js`
3. Style in `public/styles.css`
4. Test in browser
5. Add Playwright test if critical

---

## Testing

### Manual Testing

1. Test all user flows
2. Check responsive design
3. Test in different browsers
4. Verify error handling

### Automated Testing

Add tests in `tests/`:

```javascript
async function testNewFeature(page) {
  log('Testing new feature...', 'INFO');
  
  try {
    await page.goto('http://localhost:3000');
    await page.click('#newButton');
    
    const result = await page.textContent('#result');
    assertEqual(result, 'Expected', 'New Feature Test');
  } catch (error) {
    log(`Test failed: ${error.message}`, 'FAIL');
    results.failed.push({ test: 'New Feature', error: error.message });
  }
}
```

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added (if needed)
- [ ] Documentation updated
- [ ] No console.logs left in code
- [ ] No sensitive data committed

### PR Description

Include:
- What changed
- Why it changed
- How to test
- Screenshots (for UI changes)
- Related issues

**Example:**
```markdown
## Changes
- Added dark mode toggle
- Updated styles for better contrast

## Why
Users requested dark mode for better readability

## Testing
1. Click settings icon
2. Toggle dark mode
3. Verify colors change correctly

## Screenshots
[Before/After images]

Closes #123
```

---

## Review Process

1. Submit PR
2. Automated tests run
3. Code review by maintainers
4. Address feedback
5. Merge when approved

---

## Questions?

- Open an issue for discussion
- Join our Discord (coming soon)
- Email: dev@wordfrequency.app

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to learn and improve.

---

**Thank you for contributing! 🙏**
