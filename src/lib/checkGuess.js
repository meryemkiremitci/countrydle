import { byName, closest, findAlias, findExact, wordOf } from './countries.js';

// Decides what the player meant. Returns one of:
//   { type: 'valid', country }          exact country of the right length
//   { type: 'suggest', country }        "did you mean ...?" (right length)
//   { type: 'wrong_length', country }   a real country, but not the right length
//   { type: 'not_country', offline? }   off-theme input
// Cheap local checks run first; Gemini is only asked when they cannot decide.
const cache = new Map();

export async function checkGuess(word, answers) {
  const length = word.length; // the board only accepts full-length words
  const classify = (country) =>
    wordOf(country).length === length && answers.includes(country)
      ? { type: 'suggest', country }
      : { type: 'wrong_length', country };

  const exact = findExact(word);
  if (exact) return answers.includes(exact) ? { type: 'valid', country: exact } : classify(exact);

  const alias = findAlias(word);
  if (alias) return classify(alias);

  const typo = closest(word, answers, 1);
  if (typo) return { type: 'suggest', country: typo };

  if (cache.has(word)) return cache.get(word);
  let result;
  try {
    const response = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: word, length }),
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const { country } = await response.json();
    result = country && byName.has(country) ? classify(byName.get(country)) : { type: 'not_country' };
    cache.set(word, result);
  } catch (err) {
    // LLM unavailable (no key, quota exceeded...): fall back to a looser local match.
    console.warn('LLM check failed, using local fallback:', err);
    const loose = closest(word, answers, 2);
    result = loose ? { type: 'suggest', country: loose } : { type: 'not_country', offline: true };
  }
  return result;
}
