import COUNTRIES from '../data/countries.json';

export { COUNTRIES };

// "Côte d'Ivoire" -> "COTEDIVOIRE", "Pérou" -> "PEROU" (accents are stripped from input)
export function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleUpperCase('en')
    .replace(/[^A-Z]/g, '');
}

export const wordOf = (country) => normalize(country.name);

export const byCode = new Map(COUNTRIES.map((c) => [c.cca2, c]));
export const byName = new Map(COUNTRIES.map((c) => [c.name, c]));
const byWord = new Map(COUNTRIES.map((c) => [wordOf(c), c]));

// Official names and alternative spellings, e.g. "BURMA" -> Myanmar.
const byAlias = new Map();
for (const c of COUNTRIES) {
  for (const alias of [c.official, ...c.altSpellings]) {
    const key = alias && normalize(alias);
    if (key && !byWord.has(key) && !byAlias.has(key)) byAlias.set(key, c);
  }
}

// Countries that can be a secret word: single-word names of the given length.
export function answersFor(length) {
  return COUNTRIES.filter((c) => !/[\s-]/.test(c.name) && wordOf(c).length === length);
}

export function findExact(word) {
  return byWord.get(word) || null;
}

export function findAlias(word) {
  return byAlias.get(word) || null;
}

function levenshtein(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

// The single closest candidate within maxDistance edits, or null if none / tied.
export function closest(word, candidates, maxDistance) {
  let best = null;
  let bestDistance = Infinity;
  let tied = false;
  for (const c of candidates) {
    const d = levenshtein(word, wordOf(c));
    if (d < bestDistance) [best, bestDistance, tied] = [c, d, false];
    else if (d === bestDistance) tied = true;
  }
  return best && bestDistance <= maxDistance && !tied ? best : null;
}
