/**
 * Word Frequency Analyzer
 * Tokenizes text and analyzes word frequency
 */

// Common English stopwords
const STOPWORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
  'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some',
  'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after',
  'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
]);

/**
 * Analyzes word frequency in text
 * @param {string} text - The text to analyze
 * @param {object} options - Analysis options
 * @returns {object} Analysis results
 */
function analyzeWordFrequency(text, options = {}) {
  const {
    minLength = 2,
    maxResults = 100,
    caseSensitive = false,
    includeStopwords = false
  } = options;

  // Convert to lowercase unless case sensitive
  const processedText = caseSensitive ? text : text.toLowerCase();

  // Tokenize: split by non-word characters
  const words = processedText.match(/\b[a-zA-Z]+\b/g) || [];

  // Count frequency
  const frequencyMap = new Map();
  let totalWords = 0;

  for (const word of words) {
    // Filter by length
    if (word.length < minLength) continue;
    
    // Filter stopwords
    if (!includeStopwords && STOPWORDS.has(word)) continue;

    totalWords++;
    frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
  }

  // Convert to array and sort by frequency
  const results = Array.from(frequencyMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: ((count / totalWords) * 100).toFixed(2)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxResults);

  return {
    results,
    totalWords,
    uniqueWords: frequencyMap.size,
    stats: {
      totalWordsAnalyzed: words.length,
      wordsAfterFiltering: totalWords,
      uniqueWords: frequencyMap.size
    }
  };
}

module.exports = { analyzeWordFrequency };
