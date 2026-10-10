import { MAX_GUESSES } from '../lib/game.js';

export default function Board({ guesses, current, length, shake, selected, onSelect }) {
  const rows = [];
  for (let r = 0; r < MAX_GUESSES; r++) {
    const guess = guesses[r];
    if (guess) {
      rows.push(
        <div
          key={r}
          className={`row submitted ${selected === guess.country.cca2 ? 'selected' : ''}`}
          onClick={() => onSelect(guess.country.cca2)}
          title={`${guess.country.name} hakkında bilgi`}
        >
          <div className="tiles">
            {[...guess.word].map((ch, i) => (
              <div key={i} className={`tile ${guess.score[i]}`} style={{ animationDelay: `${i * 90}ms` }}>
                {ch}
              </div>
            ))}
          </div>
          <div className="hint">
            {guess.won ? (
              <span className="hint-win">🎉</span>
            ) : (
              <>
                <span>{guess.hint.km.toLocaleString('tr-TR')} km</span>
                <span className="hint-arrow">{guess.hint.arrow}</span>
                <span>%{guess.hint.proximity}</span>
              </>
            )}
          </div>
        </div>,
      );
    } else {
      const isCurrent = r === guesses.length;
      const letters = isCurrent ? current : '';
      rows.push(
        <div key={r} className={`row ${isCurrent && shake ? 'shake' : ''}`}>
          <div className="tiles">
            {Array.from({ length }, (_, i) => (
              <div key={i} className={`tile ${letters[i] ? 'filled' : ''}`}>
                {letters[i] || ''}
              </div>
            ))}
          </div>
          <div className="hint empty" />
        </div>,
      );
    }
  }
  return <div className="board">{rows}</div>;
}
