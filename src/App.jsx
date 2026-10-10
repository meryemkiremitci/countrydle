import { useCallback, useEffect, useMemo, useState } from 'react';
import Board from './components/Board.jsx';
import Keyboard from './components/Keyboard.jsx';
import MapView from './components/MapView.jsx';
import CountryCard from './components/CountryCard.jsx';
import Dialog from './components/Dialog.jsx';
import Help from './components/Help.jsx';
import { answersFor, byCode, normalize, wordOf } from './lib/countries.js';
import { checkGuess } from './lib/checkGuess.js';
import { MAX_GUESSES, hint, proximityColor, scoreGuess } from './lib/game.js';

const LENGTH = 5;
const ANSWERS = answersFor(LENGTH);
const ANSWER_COLOR = '#22c55e';
const EMOJI = { correct: '🟩', present: '🟨', absent: '⬛' };

function newGame(previous) {
  let answer;
  do answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
  while (answer === previous && ANSWERS.length > 1);
  return { answer, guesses: [], status: 'playing' };
}

export default function App() {
  const [game, setGame] = useState(() => newGame());
  const [current, setCurrent] = useState('');
  const [pending, setPending] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [shake, setShake] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { answer, guesses, status } = game;

  const flash = useCallback((text) => {
    setToast(text);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = useCallback(
    (country) => {
      if (guesses.some((g) => g.country === country)) return flash(`${country.name} was already guessed`);
      const word = wordOf(country);
      const won = country === answer;
      const next = [...guesses, { word, country, score: scoreGuess(word, wordOf(answer)), hint: hint(country, answer), won }];
      const over = won || next.length >= MAX_GUESSES;
      setGame({ answer, guesses: next, status: won ? 'won' : over ? 'lost' : 'playing' });
      setCurrent('');
      setSelected(over ? answer.cca2 : country.cca2);
    },
    [answer, guesses, flash],
  );

  const submit = useCallback(async () => {
    if (current.length < LENGTH) return flash(`Country name must be ${LENGTH} letters`);
    setPending(true);
    const result = await checkGuess(current, ANSWERS);
    setPending(false);
    if (result.type === 'valid') commit(result.country);
    else setDialog({ ...result, word: current });
  }, [current, commit, flash]);

  const onKey = useCallback(
    (key) => {
      if (status !== 'playing' || pending || dialog) return;
      if (key === 'Enter') submit();
      else if (key === 'Backspace') setCurrent((c) => c.slice(0, -1));
      else {
        const letter = normalize(key); // accented letters are reduced to their base letter
        if (letter.length === 1) setCurrent((c) => (c.length < LENGTH ? c + letter : c));
      }
    },
    [status, pending, dialog, submit],
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || showHelp) return;
      if (e.key === 'Enter' || e.key === 'Backspace' || e.key.length === 1) {
        if (e.key === 'Enter' && e.target.tagName === 'BUTTON') return; // let the focused button handle it
        onKey(e.key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, showHelp]);

  const acceptSuggestion = useCallback(() => {
    const { country } = dialog;
    setDialog(null);
    commit(country);
  }, [dialog, commit]);
  // A rejected word leaves the board, so the input is cleared for the next one.
  const closeDialog = useCallback(() => {
    setDialog(null);
    setCurrent('');
  }, []);

  const markers = useMemo(() => {
    const list = guesses.map((g) => ({
      country: g.country,
      color: g.won ? ANSWER_COLOR : proximityColor(g.hint.proximity),
      label: `${g.country.flag} ${g.country.name}${g.won ? ' 🎉' : ` · ${g.hint.km.toLocaleString('en-US')} km ${g.hint.arrow}`}`,
    }));
    if (status === 'lost') list.push({ country: answer, color: ANSWER_COLOR, label: `${answer.flag} ${answer.name} (secret)` });
    return list;
  }, [guesses, status, answer]);

  const selectedCountry = selected ? byCode.get(selected) : null;
  const selectedGuess = guesses.find((g) => g.country.cca2 === selected);

  function restart() {
    setGame(newGame(answer));
    setCurrent('');
    setSelected(null);
    setDialog(null);
  }

  async function share() {
    const lines = guesses.map(
      (g) => g.score.map((s) => EMOJI[s]).join('') + (g.won ? ' 🎉' : ` ${g.hint.km.toLocaleString('en-US')} km ${g.hint.arrow}`),
    );
    const text = `Countrydle 🌍 ${status === 'won' ? guesses.length : 'X'}/${MAX_GUESSES}\n${lines.join('\n')}\n${location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setToast('Result copied to clipboard');
    } catch {
      setToast('Could not copy');
    }
  }

  return (
    <div className="app">
      <header>
        <div className="brand">
          <h1>COUNTRYDLE</h1>
          <span className="theme-chip">🌍 Theme: Countries · {LENGTH} letters</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => setShowHelp(true)} aria-label="How to play">
            ?
          </button>
          <button className="icon-btn" onMouseDown={(e) => e.preventDefault()} onClick={restart} aria-label="New game" title="New game">
            ↻
          </button>
        </div>
      </header>

      <main>
        <section className="play">
          <Board
            guesses={guesses}
            current={current}
            length={LENGTH}
            shake={shake}
            selected={selected}
            onSelect={setSelected}
          />
          <div className="status-line">
            {pending && <span className="checking">🤖 Referee is checking…</span>}
            {toast && <span className="toast">{toast}</span>}
          </div>
          {status === 'playing' ? (
            <Keyboard guesses={guesses} onKey={onKey} />
          ) : (
            <div className={`result ${status}`}>
              <div className="result-title">
                {status === 'won' ? `Well done! You found it in ${guesses.length}/${MAX_GUESSES} guesses 🎉` : 'Out of guesses 😔'}
              </div>
              <div>
                The secret country was: <b>{answer.flag} {answer.name}</b>
              </div>
              <div className="result-actions">
                <button className="btn secondary" onClick={share}>
                  Share result
                </button>
                <button className="btn primary" onClick={restart}>
                  New game
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="explore">
          <MapView markers={markers} selected={selected} onSelect={setSelected} />
          <CountryCard
            country={selectedCountry}
            hint={selectedGuess?.hint}
            isAnswer={status !== 'playing' && selected === answer.cca2}
          />
        </section>
      </main>

      {dialog && <Dialog dialog={dialog} length={LENGTH} onAccept={acceptSuggestion} onClose={closeDialog} />}
      {showHelp && <Help length={LENGTH} onClose={() => setShowHelp(false)} />}
    </div>
  );
}
