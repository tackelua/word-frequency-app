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
async function analyzeWordFrequency(text, options = {}) {
  const {
    minLength = 2,
    maxResults = 100,
    caseSensitive = false,
    includeStopwords = false,
    skipContext = false
  } = options;

  // Preprocess text to handle PDF line breaks
  // Replace single newlines with spaces, keep double newlines as paragraph breaks
  const sanitizedText = text.replace(/(?<!\n)\n(?!\n)/g, ' ');

  // Convert to lowercase unless case sensitive
  const processedText = caseSensitive ? sanitizedText : sanitizedText.toLowerCase();

  // Tokenize words
  const words = processedText.match(/\b[a-zA-Z]+\b/g) || [];

  // Count frequency
  const frequencyMap = new Map();
  let totalWords = 0;
  let wordIdx = 0;

  for (const word of words) {
    // NEW: Yield to event loop every 10k words to allow interleaved parallel counting
    if (wordIdx++ % 10000 === 0) {
      await new Promise(resolve => setImmediate(resolve));
    }

    // Filter by length
    if (word.length < minLength) continue;

    // Filter stopwords
    if (!includeStopwords && STOPWORDS.has(word)) continue;

    totalWords++;
    frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
  }

  // Initial results without context
  let results = Array.from(frequencyMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : 0,
      context: [] // Empty initially
    }))
    .sort((a, b) => b.count - a.count);

  // If we're skipping context, return early
  if (skipContext) {
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

  // Otherwise, extract context immediately (blocking behavior for backward compatibility)
  const topWords = results.slice(0, isFinite(maxResults) ? maxResults : frequencyMap.size)
    .map(item => item.word);

  const contextMap = await extractContexts(text, topWords, { caseSensitive });

  // Merge contexts
  if (contextMap) {
    results.forEach(item => {
      if (contextMap.has(item.word)) {
        item.context = contextMap.get(item.word);
      }
    });
  }

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

/**
 * Extracts context sentences for specific words
 * @param {string} text - The full text
 * @param {string[]} targetWords - Words to find context for
 * @param {object} options - Options
 * @returns {Map<string, string[]>} Map of word -> context sentences
 */
/**
 * Extracts context sentences for specific words
 * @param {string} text - The full text
 * @param {string[]} targetWords - Words to find context for
 * @param {object} options - Options
 * @returns {Map<string, string[]>} Map of word -> context sentences
 */
async function extractContexts(text, targetWords, options = {}) {
  const { caseSensitive = false } = options;
  const wordContexts = new Map(); // word -> Array<{ text: string, score: number }>
  const targetSet = new Set(targetWords);

  // Tokenize sentences
  const sanitizedText = text.replace(/(?<!\n)\n(?!\n)/g, ' ');
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(sanitizedText);

  if (sentences && sentences.length > 0) {
    let i = 0;
    for (const sentence of sentences) {
      // Check for abortion every 10 sentences to avoid overhead
      if (i % 10 === 0 && options.checkAbort && options.checkAbort()) {
        console.log('🛑 extractContexts: Abort signal received');
        return null;
      }

      // NEW: Yield to event loop every 20 sentences to keep server responsive
      if (i % 20 === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
      i++;

      // 1. Hard Filter: Skip bad sentences immediately
      if (!isValidContext(sentence)) continue;

      const sentenceLower = caseSensitive ? sentence : sentence.toLowerCase();
      const wordsInSentence = sentenceLower.match(/\b[a-zA-Z]+\b/g) || [];

      // Check each word in the sentence
      for (const word of wordsInSentence) {
        if (targetSet.has(word)) {
          if (!wordContexts.has(word)) {
            wordContexts.set(word, []);
          }

          const contexts = wordContexts.get(word);

          // 2. Collect candidates (limit to 50 to avoid memory bloat)
          if (contexts.length < 50) {
            const score = scoreSentence(sentence, word);
            contexts.push({ text: sentence.trim(), score });
          }
        }
      }
    }
  }

  // 3. Sort and Select Top 5 for each word
  const finalContexts = new Map();
  let sortIdx = 0;
  for (const [word, candidates] of wordContexts.entries()) {
    // NEW: Yield every 100 words during sorting to keep loop responsive
    if (sortIdx++ % 100 === 0) {
      await new Promise(resolve => setImmediate(resolve));
    }

    // Sort by score desc, then by length (prefer shorter valid ones if scores tie)
    candidates.sort((a, b) => b.score - a.score);

    // Keep only unique sentences (deduplicate)
    const unique = [];
    const seen = new Set();

    for (const c of candidates) {
      if (!seen.has(c.text)) {
        seen.add(c.text);
        unique.push(c.text);
        if (unique.length >= 5) break;
      }
    }

    finalContexts.set(word, unique);
  }

  return finalContexts;
}

/**
 * Checks if a sentence is valid for context
 * Rejects: too short, excessive symbols, repeated dots
 */
function isValidContext(sentence) {
  const trimmed = sentence.trim();
  if (trimmed.length < 10) return false; // Too short characters (approx < 2 words)

  const words = trimmed.match(/\b[a-zA-Z]+\b/g) || [];
  if (words.length < 4) return false; // Too few words
  if (words.length > 60) return false; // Too long, likely a list or parsing error

  // Check for excessive non-alphanumeric characters (noise ratio > 30%)
  const nonAlpha = trimmed.replace(/[a-zA-Z0-9\s]/g, '').length;
  if (nonAlpha / trimmed.length > 0.3) return false;

  // Check for "....." or "._._" patterns
  if (/\.{3,}/.test(trimmed)) return false; // 3 or more dots

  return true;
}

/**
 * Scores a sentence based on quality
 */
function scoreSentence(sentence, targetWord) {
  let score = 0;
  const trimmed = sentence.trim();

  // 1. Capitalization: Starts with uppercase
  if (/^[A-Z]/.test(trimmed)) score += 2;

  // 2. Punctuation: Ends with proper punctuation
  if (/[.!?]$/.test(trimmed)) score += 1;
  else score -= 1; // Penalize fragmented sentences

  // 3. Length preference: 10-30 words is sweet spot
  const words = trimmed.split(/\s+/).length;
  if (words >= 10 && words <= 30) score += 2;
  else if (words > 30) score += 0; // Neutral
  else score -= 1; // Slightly short

  // 4. Position: Target word is not at the very edges (more context)
  // Only rough check since tokenization might vary
  if (!trimmed.toLowerCase().startsWith(targetWord.toLowerCase()) &&
    !trimmed.toLowerCase().endsWith(targetWord.toLowerCase())) {
    score += 1;
  }

  return score;
}

module.exports = { analyzeWordFrequency, extractContexts };
