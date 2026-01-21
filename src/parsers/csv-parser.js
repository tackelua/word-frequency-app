const fs = require('fs');
const { parse } = require('csv-parse/sync');

/**
 * Parses CSV file and extracts text from all cells
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<string>} Extracted text
 */
async function parseCSV(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const records = parse(fileContent, {
            skip_empty_lines: true,
            relax_column_count: true
        });

        // Flatten all cells into text
        const text = records
            .flat()
            .filter(cell => cell && typeof cell === 'string')
            .join(' ');

        return text;
    } catch (error) {
        throw new Error(`Failed to parse CSV: ${error.message}`);
    }
}

module.exports = { parseCSV };
