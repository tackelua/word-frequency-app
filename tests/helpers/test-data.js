/**
 * Test Data Helper
 * Provides sample data and file paths for testing
 */

const path = require('path');

// Sample test data
const TEST_DATA = {
    users: {
        valid: {
            email: 'test@example.com',
            otp: '123456'
        },
        invalid: {
            email: 'invalid-email',
            otp: '000000'
        }
    },

    feedback: {
        bug: {
            type: 'bug',
            content: 'Test bug report: Login button not working',
            email: 'tester@example.com'
        },
        feature: {
            type: 'feature',
            content: 'Test feature request: Add dark mode toggle',
            email: 'tester@example.com'
        },
        general: {
            type: 'general',
            content: 'Great app! Really helpful for learning.',
            email: ''
        }
    },

    sampleText: `
    The quick brown fox jumps over the lazy dog.
    The dog was lazy but the fox was quick.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    The quick brown fox appears twice in this text.
  `.trim()
};

// Sample file paths (these would need to be created for real tests)
const SAMPLE_FILES = {
    pdf: path.join(__dirname, '../fixtures/sample.pdf'),
    docx: path.join(__dirname, '../fixtures/sample.docx'),
    txt: path.join(__dirname, '../fixtures/sample.txt'),
    csv: path.join(__dirname, '../fixtures/sample.csv'),
    invalid: path.join(__dirname, '../fixtures/invalid.exe')
};

// Expected word frequency results for sample text
const EXPECTED_RESULTS = {
    topWords: ['the', 'quick', 'brown', 'fox'],
    totalWords: 28,
    uniqueWords: 20
};

module.exports = {
    TEST_DATA,
    SAMPLE_FILES,
    EXPECTED_RESULTS
};
