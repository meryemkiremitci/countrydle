const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const RANK = { absent: 1, present: 2, correct: 3 };

// Keys must not take focus, otherwise a physical Enter would "click" the last tapped key.
const NO_FOCUS = { tabIndex: -1, onMouseDown: (e) => e.preventDefault() };

export default function Keyboard({ guesses, onKey }) {
  const states = {};
  for (const g of guesses) {
    [...g.word].forEach((ch, i) => {
      if ((RANK[g.score[i]] || 0) > (RANK[states[ch]] || 0)) states[ch] = g.score[i];
    });
  }

  return (
    <div className="keyboard">
      {ROWS.map((row, r) => (
        <div key={r} className="key-row">
          {r === 2 && (
            <button className="key wide" {...NO_FOCUS} onClick={() => onKey('Enter')}>
              ENTER
            </button>
          )}
          {[...row].map((ch) => (
            <button key={ch} className={`key ${states[ch] || ''}`} {...NO_FOCUS} onClick={() => onKey(ch)}>
              {ch}
            </button>
          ))}
          {r === 2 && (
            <button className="key wide" {...NO_FOCUS} onClick={() => onKey('Backspace')} aria-label="Delete">
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
