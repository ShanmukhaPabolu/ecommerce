// Small dependency-free helpers for typo-tolerant, relevance-ranked product search.
// Kept intentionally simple (no external NLP/fuzzy-search libraries) since this is
// a 2-day prototype — but it demonstrates real partial-match + typo tolerance
// rather than a plain substring check.

function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

// Returns a relevance score (higher is better) for how well `query` matches `text`,
// or 0 if there's no reasonable match (including a typo-tolerant fuzzy match).
function matchScore(query, text) {
  if (!query || !text) return 0;
  const q = query.trim().toLowerCase();
  const t = text.trim().toLowerCase();
  if (!q) return 0;

  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;

  // Word-level typo tolerance: e.g. "pikle" -> "pickle", "mango pikle" -> matches "Mango Pickle"
  const queryWords = q.split(/\s+/).filter(Boolean);
  const textWords = t.split(/\s+/).filter(Boolean);
  let fuzzyHits = 0;
  for (const qw of queryWords) {
    const hit = textWords.some((tw) => {
      if (tw.includes(qw) || qw.includes(tw)) return true;
      const maxAllowedDistance = qw.length <= 4 ? 1 : 2;
      return levenshtein(qw, tw) <= maxAllowedDistance;
    });
    if (hit) fuzzyHits++;
  }
  if (fuzzyHits === 0) return 0;
  // Partial credit if only some words of a multi-word query matched.
  return Math.round((fuzzyHits / queryWords.length) * 40);
}

// Scores a product against a search query across its name, tagline, category, and tags,
// weighting the product name highest.
function productMatchScore(product, query) {
  if (!query) return 0;
  const nameScore = matchScore(query, product.name) * 1.5;
  const taglineScore = matchScore(query, product.tagline || "");
  const categoryScore = matchScore(query, product.category || "");
  const tagScore = Math.max(0, ...(product.tags || []).map((t) => matchScore(query, t)));
  return Math.round(Math.max(nameScore, taglineScore, categoryScore, tagScore));
}

module.exports = { levenshtein, matchScore, productMatchScore };
