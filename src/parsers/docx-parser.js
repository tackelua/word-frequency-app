const mammoth = require('mammoth');

/**
 * Parses DOCX file and extracts text
 * @param {string} filePath - Path to DOCX file
 * @returns {Promise<string>} Extracted text
 */
async function parseDOCX(filePath) {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } catch (error) {
        throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
}

module.exports = { parseDOCX };
