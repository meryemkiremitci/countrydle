export default function Help({ length, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog help" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2>How to play</h2>
        <p>
          Find the secret country in 6 guesses. Guesses must be <b>{length}-letter English country names</b> (e.g. JAPAN,
          CHILE).
        </p>
        <div className="help-tiles">
          <div className="tile correct">J</div> letter is in the right spot
        </div>
        <div className="help-tiles">
          <div className="tile present">A</div> letter is in the country but in another spot
        </div>
        <div className="help-tiles">
          <div className="tile absent">N</div> letter is not in the country
        </div>
        <p>
          Next to each guess you see the <b>distance</b>, <b>direction</b> and <b>proximity</b> to the secret country.
          Guessed countries are marked on the map; click one to see its details.
        </p>
        <p>
          🤖 The AI referee recognizes misspelled country names and asks <i>"Did you mean ...?"</i>. Words that are not
          countries, and countries with the wrong number of letters, do not cost you a guess.
        </p>
        <div className="dialog-actions">
          <button className="btn primary" onClick={onClose} autoFocus>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
