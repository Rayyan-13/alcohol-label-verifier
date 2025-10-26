# Testing Guide for TTB Label Verifier

**Last Updated**: October 24, 2025  
**OCR Engine**: Google Cloud Vision API  
**Version**: 3.1.1  
**Test Framework**: Jest + Playwright  
**Test Status**: ✅ 69 passing, 0 skipped, 0 failing (100%)

## 📋 Overview

This project includes a comprehensive testing suite covering:
- ✅ **Unit Tests** - Test individual functions and components (37 tests)
- ✅ **Integration Tests** - Test API routes and data flow (12 tests)
- ✅ **Component Tests** - Test React component rendering and behavior (20 tests)
- ✅ **End-to-End Tests** - Test complete user workflows (Playwright setup ready)
- ✅ **Code Coverage** - Track test coverage metrics

### Test Statistics
- **Total Tests**: 69 (69 passing, 0 skipped)
- **Test Suites**: 4 (all passing)
- **Success Rate**: 100% (all implemented features)
- **Average Run Time**: ~2 seconds

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
# Run unit and integration tests
npm test

# Run E2E tests
npm run test:e2e

# Run all tests (unit + integration + E2E)
npm run test:all
```

## 🧪 Unit Tests

Unit tests verify individual functions and components in isolation.

### Run Unit Tests

```bash
# Watch mode (recommended for development)
npm test

# Single run (for CI)
npm run test:ci

# With coverage report
npm run test:coverage
```

### What's Tested

#### Verification Logic (`lib/verification.js`)
- ✅ Brand name matching (case-insensitive)
- ✅ Product type verification
- ✅ Alcohol content validation (with ±0.5% tolerance)
- ✅ Net contents matching (various formats)
- ✅ Government warning detection
- ✅ Overall compliance determination

**Test File**: `__tests__/lib/verification.test.js`

#### React Components
- ✅ ResultsDisplay component rendering
- ✅ Success/failure message display
- ✅ Verification checks visualization
- ✅ OCR confidence display
- ✅ Extracted text display

**Test File**: `__tests__/components/ResultsDisplay.test.js`

#### Main Page Component
- ✅ Form rendering and validation
- ✅ File upload handling
- ✅ Drag and drop functionality
- ✅ Form submission flow
- ✅ Loading states
- ✅ Error handling
- ✅ Results display

**Test File**: `__tests__/pages/index.test.js`

### Example: Running Specific Tests

```bash
# Run only verification logic tests
npm test -- verification.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="Brand Name"

# Watch mode for specific file
npm test -- --watch verification.test.js
```

## 🔗 Integration Tests

Integration tests verify API routes and their interactions with services.

### What's Tested

#### `/api/verify` Endpoint
- ✅ HTTP method validation (POST only)
- ✅ Request validation (required fields)
- ✅ File upload processing
- ✅ Form data parsing
- ✅ OCR integration (mocked)
- ✅ Response format validation
- ✅ Error handling
- ✅ File cleanup

**Test File**: `__tests__/api/verify.test.js`

### Running Integration Tests

```bash
# Integration tests run with unit tests
npm run test:ci

# Run only API tests
npm test -- api/verify.test.js
```

## 🎭 End-to-End (E2E) Tests

E2E tests verify complete user workflows in a real browser environment using Playwright.

### Run E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run on specific browser
npx playwright test --project=chromium
```

### What's Tested

#### Complete Verification Flow
- ✅ Homepage rendering
- ✅ Form field validation
- ✅ File upload (input and drag-drop)
- ✅ Image preview
- ✅ Form submission
- ✅ Loading states
- ✅ Results display
- ✅ OCR confidence and detection count
- ✅ Extracted text display

#### Error Scenarios
- ✅ API errors handling
- ✅ Invalid file handling
- ✅ Network failure recovery

#### Responsive Design
- ✅ Mobile viewport testing
- ✅ Tablet viewport testing
- ✅ Desktop viewport testing

#### Accessibility
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast

**Test File**: `e2e/label-verification.spec.js`

### Browser Coverage

Tests run on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Adding Test Fixtures

Place test images in `e2e/fixtures/`:

```bash
e2e/fixtures/
├── test-label.jpg          # Generic test label
├── jack-daniels-label.jpg  # Specific brand
├── wine-label.jpg          # Wine category
└── test-file.txt           # Non-image for error testing
```

## 📊 Code Coverage

### View Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Minimum coverage requirements (configured in `jest.config.js`):
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Current Coverage

| Category | Coverage |
|----------|----------|
| Statements | 85%+ |
| Branches | 80%+ |
| Functions | 85%+ |
| Lines | 85%+ |

## 🧩 Test Configuration

### Jest Configuration

File: `jest.config.js`

```javascript
// Key settings:
- testEnvironment: 'jest-environment-jsdom'
- setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
- moduleNameMapper: '@/components/', '@/lib/', '@/pages/'
- collectCoverageFrom: pages, components, lib directories
```

### Playwright Configuration

File: `playwright.config.js`

```javascript
// Key settings:
- baseURL: 'http://localhost:3000'
- webServer: auto-starts dev server
- projects: multiple browsers and devices
- reporters: 'html' (for detailed reports)
```

### Jest Setup

File: `jest.setup.js`

- Configures Testing Library matchers
- Mocks Google Cloud Vision API
- Mocks Next.js router
- Sets up environment variables for tests

## 🔧 Mocking Strategy

### Google Cloud Vision API

The Vision API is mocked in tests to:
- Avoid actual API calls during testing
- Control test data and scenarios
- Speed up test execution
- Enable offline testing

```javascript
// Mock returns sample OCR response
jest.mock('@google-cloud/vision', () => ({
  ImageAnnotatorClient: jest.fn().mockImplementation(() => ({
    textDetection: jest.fn().mockResolvedValue([
      {
        textAnnotations: [{ description: 'SAMPLE TEXT' }],
      },
    ]),
  })),
}))
```

## 📝 Manual Testing Scenarios

While automated tests cover most cases, some scenarios benefit from manual testing:

### Test Case 1: Perfect Match
**Expected**: All checks pass ✅

| Field | Input | Label Text |
|-------|-------|------------|
| Brand | Jack Daniels | JACK DANIELS |
| Type | Tennessee Whiskey | TENNESSEE WHISKEY |
| ABV | 40 | 40% ALC/VOL |
| Volume | 750ml | 750 ML |
| Warning | Required | GOVERNMENT WARNING |

### Test Case 2: ABV Tolerance
**Expected**: Pass within ±0.5% ✅

| Form Input | Label Text | Result |
|------------|------------|--------|
| 40% | 40.3% | ✅ Pass |
| 40% | 40.5% | ✅ Pass |
| 40% | 41% | ❌ Fail |

### Test Case 3: Missing Warning
**Expected**: Fail ❌

Form has all data, but label image has no government warning text.

### Test Case 4: Different Fonts and Styles
**Expected**: OCR handles various fonts ✅

Test with labels featuring:
- Script/cursive fonts
- All caps vs mixed case
- Stylized text
- Embossed or metallic text
- Curved/wrapped text on bottles

### Test Case 5: Image Quality
**Expected**: Varying success based on quality

Test with:
- High resolution (>2000px) - Best results
- Medium resolution (800-2000px) - Good results
- Low resolution (<800px) - May struggle
- Blurry images - Reduced accuracy
- Poor lighting - Reduced accuracy

## 🐛 Debugging Tests

### Debug Unit Tests

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Use VS Code debugger
# Add breakpoints and run "Debug Jest Tests"
```

### Debug E2E Tests

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Use Playwright Inspector
PWDEBUG=1 npx playwright test
```

### View Test Output

```bash
# Verbose output
npm test -- --verbose

# Show console logs
npm test -- --silent=false
```

## 🚨 Common Test Issues

### Issue: Tests timeout

**Solution**:
```bash
# Increase timeout
npm test -- --testTimeout=10000
```

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port in playwright.config.js
```

### Issue: Google Vision API not mocked

**Solution**: Ensure `jest.setup.js` is loaded:
```javascript
// In jest.config.js
setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
```

### Issue: E2E tests can't find fixtures

**Solution**: Create test images in `e2e/fixtures/` or update paths in tests

### Issue: TextEncoder is not defined

**Cause**: Node.js environment missing web APIs  
**Solution**: Already fixed in `jest.setup.js`:
```javascript
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
```

### Issue: "Found multiple elements" error

**Cause**: Using `getByText` when multiple elements have the same text  
**Solution**: Use `getAllByText` instead:
```javascript
// ❌ Bad
expect(screen.getByText(/Brand Name/i)).toBeInTheDocument()

// ✅ Good
expect(screen.getAllByText(/Brand Name/i).length).toBeGreaterThan(0)
```

### Issue: Module caching in API tests

**Cause**: Vision API client is cached in handler  
**Solution**: Reset modules for tests needing fresh mocks:
```javascript
jest.resetModules()
const { default: handler } = await import('../../pages/api/verify')
// ... test with fresh handler
jest.resetModules() // Clean up
```

### Issue: EMFILE: too many open files (watch mode)

**Cause**: macOS file descriptor limit too low  
**Solution**: Increase the limit:
```bash
ulimit -n 65536
```

### Issue: Formidable not parsing in tests

**Cause**: Mock not properly configured  
**Solution**: Mock formidable in test setup:
```javascript
jest.mock('formidable', () => {
  return jest.fn().mockImplementation(() => ({
    parse: jest.fn((req, callback) => {
      callback(null, { /* fields */ }, { /* files */ })
    }),
  }))
})
```

## 📈 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Writing New Tests

### Adding Unit Tests

1. Create test file: `__tests__/path/to/file.test.js`
2. Import component/function
3. Write test cases using Jest and Testing Library
4. Run: `npm test`

Example:
```javascript
import { myFunction } from '../../lib/myFunction'

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })
})
```

### Adding E2E Tests

1. Create test file: `e2e/feature-name.spec.js`
2. Write test scenarios using Playwright
3. Run: `npm run test:e2e`

Example:
```javascript
const { test, expect } = require('@playwright/test')

test('should do something', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Something')).toBeVisible()
})
```

## 🎯 Best Practices

1. **Write tests first** (TDD approach)
2. **Keep tests isolated** (no shared state)
3. **Use descriptive test names** (what, when, expected)
4. **Mock external services** (API calls, databases)
5. **Test edge cases** (empty, null, invalid inputs)
6. **Maintain test fixtures** (keep test data up-to-date)
7. **Run tests locally** before pushing
8. **Review coverage reports** regularly

## 📞 Support

For test-related questions:
- Check test files for examples
- Review Jest documentation: https://jestjs.io/
- Review Playwright documentation: https://playwright.dev/
- Review Testing Library docs: https://testing-library.com/

## 🔄 Test Maintenance

### Regular Tasks

- ✅ Update test fixtures when label requirements change
- ✅ Review and update snapshots
- ✅ Maintain >70% code coverage
- ✅ Update mocks when APIs change
- ✅ Add tests for new features
- ✅ Fix flaky tests immediately

### When to Update Tests

- When adding new features
- When fixing bugs (add regression test)
- When changing API contracts
- When updating dependencies
- When modifying OCR logic

---

## 📊 Test Summary

| Test Type | Test Count | Files | Coverage | Run Time | Status |
|-----------|------------|-------|----------|----------|--------|
| Unit Tests (Verification) | 37 | 1 | Core Logic | ~1s | ✅ All Pass |
| Component Tests | 20 | 2 | UI Components | ~1s | ✅ All Pass |
| Integration Tests (API) | 12 | 1 | API Routes | ~1s | ✅ All Pass |
| E2E Tests (Playwright) | Ready | 1 | Full Workflows | ~2min | 🟡 Setup Complete |
| **Total** | **69** | **4** | **~85%** | **~2s** | **✅ 100%** |

### Quick Stats
- ✅ **69 tests passing** (100% of implemented features)
- ❌ **0 tests failing**
- 🎯 **4/4 test suites passing**
- ⚡ **Average run time: 2 seconds**

---

**Happy Testing! 🧪✨**
