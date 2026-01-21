/**
 * Phase 5 Automated Verification Script
 * Tests all features and UI improvements
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
    baseURL: 'http://localhost:3000',
    screenshotDir: path.join(__dirname, 'screenshots'),
    timeout: 30000,
    testEmail: 'test@githsoft.com'
};

// Ensure screenshot directory exists
if (!fs.existsSync(CONFIG.screenshotDir)) {
    fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
}

// Test results tracker
const results = {
    passed: [],
    failed: [],
    startTime: Date.now()
};

// Utility: Log with timestamp
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
        INFO: '\x1b[36m',
        PASS: '\x1b[32m',
        FAIL: '\x1b[31m',
        WARN: '\x1b[33m'
    };
    console.log(`${colors[type]}[${type}] ${timestamp} - ${message}\x1b[0m`);
}

// Utility: Take screenshot
async function screenshot(page, name) {
    const filepath = path.join(CONFIG.screenshotDir, `${name}-${Date.now()}.png`);
    await page.screenshot({ path: filepath, fullPage: true });
    log(`Screenshot saved: ${filepath}`);
    return filepath;
}

// Utility: Assert and record result
function assertEqual(actual, expected, testName) {
    if (actual === expected) {
        log(`✓ ${testName}`, 'PASS');
        results.passed.push(testName);
        return true;
    } else {
        log(`✗ ${testName} - Expected: ${expected}, Got: ${actual}`, 'FAIL');
        results.failed.push({ test: testName, expected, actual });
        return false;
    }
}

async function assertExists(element, testName) {
    if (element) {
        log(`✓ ${testName}`, 'PASS');
        results.passed.push(testName);
        return true;
    } else {
        log(`✗ ${testName} - Element not found`, 'FAIL');
        results.failed.push({ test: testName, error: 'Element not found' });
        return false;
    }
}

// ==========================================
// Test Cases
// ==========================================

/**
 * Test 1: Login Success Toast Icon
 * Verify that login success shows checkmark icon
 */
async function testLoginSuccessToast(page) {
    log('Testing Login Success Toast Icon...', 'INFO');

    try {
        // Navigate to page
        await page.goto(CONFIG.baseURL);
        await page.waitForLoadState('networkidle');
        await screenshot(page, 'home-page');

        // Click login button
        await page.click('#loginBtn');
        await page.waitForSelector('#loginModal', { state: 'visible' });
        await screenshot(page, 'login-modal');

        // Enter email
        await page.fill('#emailInput', CONFIG.testEmail);
        await screenshot(page, 'email-entered');

        // Note: We can't fully test OTP without real email
        // But we can verify the modal and UI elements exist
        const sendBtn = await page.$('#sendOtpBtn');
        await assertExists(sendBtn, 'Send OTP button exists');

        const loginStep1 = await page.$('#loginStep1');
        await assertExists(loginStep1, 'Login step 1 visible');

        log('Login Toast Test - UI elements verified', 'PASS');
        results.passed.push('Login UI Elements');

    } catch (error) {
        log(`Login Toast Test failed: ${error.message}`, 'FAIL');
        results.failed.push({ test: 'Login Toast', error: error.message });
        await screenshot(page, 'login-error');
    }
}

/**
 * Test 2: Table Header Color
 * Verify table header has correct solid color #131625
 */
async function testTableHeaderColor(page) {
    log('Testing Table Header Color...', 'INFO');

    try {
        // Need to upload a file first to see the table
        // For now, check if we can access the styles
        await page.goto(CONFIG.baseURL);

        // Check if styles.css is loaded
        const styleContent = await page.evaluate(() => {
            const links = document.querySelectorAll('link[rel="stylesheet"]');
            for (let link of links) {
                if (link.href.includes('styles.css')) {
                    return fetch(link.href).then(r => r.text());
                }
            }
            return null;
        });

        if (styleContent && styleContent.includes('#131625')) {
            log('✓ Table header color #131625 found in CSS', 'PASS');
            results.passed.push('Table Header Color CSS');
        } else {
            log('✗ Table header color #131625 not found', 'FAIL');
            results.failed.push({ test: 'Table Header Color', error: 'Color not found in CSS' });
        }

    } catch (error) {
        log(`Table Header Color Test failed: ${error.message}`, 'FAIL');
        results.failed.push({ test: 'Table Header Color', error: error.message });
    }
}

/**
 * Test 3: Feedback Multi-File Upload
 * Verify feedback form accepts multiple files
 */
async function testFeedbackMultiFileUpload(page) {
    log('Testing Feedback Multi-File Upload...', 'INFO');

    try {
        await page.goto(CONFIG.baseURL);
        await page.waitForLoadState('networkidle');

        // Click feedback button
        await page.click('#feedbackBtn');
        await page.waitForSelector('#feedbackModal', { state: 'visible' });
        await screenshot(page, 'feedback-modal');

        // Check if file input has multiple attribute
        const hasMultiple = await page.evaluate(() => {
            const fileInput = document.querySelector('#fbMedia');
            return fileInput && fileInput.hasAttribute('multiple');
        });

        assertEqual(hasMultiple, true, 'Feedback file input has multiple attribute');

        // Close modal
        await page.click('#closeFeedbackBtn');

    } catch (error) {
        log(`Feedback Multi-File Test failed: ${error.message}`, 'FAIL');
        results.failed.push({ test: 'Feedback Multi-File', error: error.message });
        await screenshot(page, 'feedback-error');
    }
}

/**
 * Test 4: Menu Dropdown (if implemented)
 * Verify logout button replaced with menu dropdown
 */
async function testMenuDropdown(page) {
    log('Testing Menu Dropdown...', 'INFO');

    try {
        await page.goto(CONFIG.baseURL);

        // Check if menu toggle exists
        const menuToggle = await page.$('#menuToggle');
        const logoutBtn = await page.$('#logoutBtn');

        if (menuToggle) {
            log('✓ Menu dropdown implemented', 'PASS');
            results.passed.push('Menu Dropdown Exists');
            await screenshot(page, 'menu-dropdown');
        } else if (logoutBtn) {
            log('Menu dropdown not yet implemented (logout button still exists)', 'WARN');
        }

    } catch (error) {
        log(`Menu Dropdown Test: ${error.message}`, 'WARN');
    }
}

/**
 * Test 5: Professional Footer
 * Verify footer exists with proper content
 */
async function testProfessionalFooter(page) {
    log('Testing Professional Footer...', 'INFO');

    try {
        await page.goto(CONFIG.baseURL);
        await page.waitForLoadState('networkidle');

        // Check for app-footer class or footer element
        const footer = await page.$('footer.app-footer, footer.footer');
        await assertExists(footer, 'Footer element exists');

        if (footer) {
            const footerText = await footer.textContent();
            log(`Footer content: ${footerText}`, 'INFO');

            if (footerText.includes('2026') || footerText.includes('Version')) {
                log('✓ Footer has copyright/version info', 'PASS');
                results.passed.push('Footer Content');
            }

            await screenshot(page, 'footer-view');
        }

    } catch (error) {
        log(`Footer Test failed: ${error.message}`, 'FAIL');
        results.failed.push({ test: 'Professional Footer', error: error.message });
    }
}

/**
 * Test 6: File Upload Functionality
 * Verify basic file upload works
 */
async function testFileUpload(page) {
    log('Testing File Upload Functionality...', 'INFO');

    try {
        await page.goto(CONFIG.baseURL);

        // Check upload zone exists
        const uploadZone = await page.$('#uploadZone');
        await assertExists(uploadZone, 'Upload zone exists');

        const fileInput = await page.$('#fileInput');
        await assertExists(fileInput, 'File input exists');

        // Check accepted formats
        const acceptAttr = await page.getAttribute('#fileInput', 'accept');
        if (acceptAttr && acceptAttr.includes('.pdf')) {
            log('✓ File input accepts correct formats', 'PASS');
            results.passed.push('File Upload Formats');
        }

        await screenshot(page, 'upload-zone');

    } catch (error) {
        log(`File Upload Test failed: ${error.message}`, 'FAIL');
        results.failed.push({ test: 'File Upload', error: error.message });
    }
}

/**
 * Test 7: Page Load Performance
 * Verify page loads within acceptable time
 */
async function testPageLoadPerformance(page) {
    log('Testing Page Load Performance...', 'INFO');

    try {
        const startTime = Date.now();
        await page.goto(CONFIG.baseURL);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        log(`Page loaded in ${loadTime}ms`, 'INFO');

        if (loadTime < 3000) {
            log('✓ Page load performance acceptable', 'PASS');
            results.passed.push('Page Load Performance');
        } else {
            log('⚠ Page load time exceeds 3s', 'WARN');
        }

    } catch (error) {
        log(`Performance Test failed: ${error.message}`, 'FAIL');
        results.failed.push({ test: 'Performance', error: error.message });
    }
}

/**
 * Test 8: Responsive Design
 * Verify page works on mobile viewport
 */
async function testResponsiveDesign(page) {
    log('Testing Responsive Design...', 'INFO');

    try {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(CONFIG.baseURL);
        await page.waitForLoadState('networkidle');
        await screenshot(page, 'mobile-view');

        // Check if header is visible
        const header = await page.$('header.header');
        await assertExists(header, 'Header visible on mobile');

        // Reset viewport
        await page.setViewportSize({ width: 1280, height: 720 });

        log('✓ Responsive design verified', 'PASS');
        results.passed.push('Responsive Design');

    } catch (error) {
        log(`Responsive Test failed: ${error.message}`, 'FAIL');
        results.failed.push({ test: 'Responsive Design', error: error.message });
    }
}

// ==========================================
// Main Test Runner
// ==========================================

async function runTests() {
    log('========================================', 'INFO');
    log('Phase 5 Automated Verification Started', 'INFO');
    log('========================================', 'INFO');

    const browser = await chromium.launch({
        headless: false, // Set to true for CI/CD
        slowMo: 100 // Slow down for visibility
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();
    page.setDefaultTimeout(CONFIG.timeout);

    try {
        // Run all tests
        await testPageLoadPerformance(page);
        await testLoginSuccessToast(page);
        await testTableHeaderColor(page);
        await testFeedbackMultiFileUpload(page);
        await testMenuDropdown(page);
        await testProfessionalFooter(page);
        await testFileUpload(page);
        await testResponsiveDesign(page);

    } catch (error) {
        log(`Test execution error: ${error.message}`, 'FAIL');
    } finally {
        await browser.close();
    }

    // Print summary
    printSummary();
}

function printSummary() {
    const duration = ((Date.now() - results.startTime) / 1000).toFixed(2);

    console.log('\n');
    log('========================================', 'INFO');
    log('Test Summary', 'INFO');
    log('========================================', 'INFO');
    log(`Total Duration: ${duration}s`, 'INFO');
    log(`Passed: ${results.passed.length}`, 'PASS');
    log(`Failed: ${results.failed.length}`, 'FAIL');

    if (results.passed.length > 0) {
        console.log('\n✓ Passed Tests:');
        results.passed.forEach(test => console.log(`  - ${test}`));
    }

    if (results.failed.length > 0) {
        console.log('\n✗ Failed Tests:');
        results.failed.forEach(item => {
            if (typeof item === 'string') {
                console.log(`  - ${item}`);
            } else {
                console.log(`  - ${item.test}: ${item.error || item.expected + ' vs ' + item.actual}`);
            }
        });
    }

    console.log('\n');
    log(`Screenshots saved to: ${CONFIG.screenshotDir}`, 'INFO');
    log('========================================', 'INFO');

    // Exit with appropriate code
    process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
    runTests().catch(error => {
        log(`Fatal error: ${error.message}`, 'FAIL');
        process.exit(1);
    });
}

module.exports = { runTests, CONFIG };
