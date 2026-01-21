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

const natural = require('natural');

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

  // Preprocess text to handle PDF line breaks
  // Replace single newlines with spaces, keep double newlines as paragraph breaks
  const sanitizedText = text.replace(/(?<!\n)\n(?!\n)/g, ' ');

  // Tokenize sentences first to preserve context
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(sanitizedText);

  // Convert to lowercase unless case sensitive
  const processedText = caseSensitive ? sanitizedText : sanitizedText.toLowerCase();

  // Tokenize words
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

  // Get top words to find context for (limit to 1000 for performance)
  let topWords = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1]);

  // Use maxResults if finite, otherwise extract context for all words
  const contextLimit = isFinite(maxResults) ? maxResults : frequencyMap.size;
  topWords = topWords.slice(0, contextLimit).map(([word]) => word);

  const wordContexts = new Map();

  // Find contexts (sentences) for top words
  // Optimization: Single pass through sentences for top words only
  if (sentences && sentences.length > 0) {
    const topWordsSet = new Set(topWords);

    for (const sentence of sentences) {
      const sentenceLower = caseSensitive ? sentence : sentence.toLowerCase();
      // quick check if sentence contains any of our words
      const wordsInSentence = sentenceLower.match(/\b[a-zA-Z]+\b/g) || [];

      for (const word of wordsInSentence) {
        if (topWordsSet.has(word)) {
          if (!wordContexts.has(word)) {
            wordContexts.set(word, []);
          }
          const contexts = wordContexts.get(word);
          // Limit to 5 examples per word
          if (contexts.length < 5) {
            contexts.push(sentence.trim());
          }
        }
      }
    }
  }

  // Convert to array and sort by frequency
  let results = Array.from(frequencyMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: ((count / totalWords) * 100).toFixed(2),
      context: wordContexts.get(word) || []
    }))
    .sort((a, b) => b.count - a.count);

  // Only slice if maxResults is finite
  if (isFinite(maxResults) && maxResults > 0) {
    results = results.slice(0, maxResults);
  }

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
