import { useEffect, useRef } from 'react';
import { wordOf } from '../lib/countries.js';

// Shows the referee's verdict: a suggestion, a wrong-length country or an off-theme word.
export default function Dialog({ dialog, length, onAccept, onClose }) {
  const isSuggestion = dialog.type === 'suggest';
  const boxRef = useRef(null);

  // Focus the box, not a button: the Enter that opened the dialog would otherwise
  // click a freshly focused button and close (or accept) the dialog instantly.
  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  // Escape closes; Enter does nothing until the user Tabs to a button and presses it.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const { country, word } = dialog;
  let icon;
  let body;
  if (dialog.type === 'suggest') {
    icon = '🤔';
    body = (
      <>
        <b>{word}</b> diye bir ülke yok. Sanırım <b>{country.flag} {country.name}</b> demek istedin?
      </>
    );
  } else if (dialog.type === 'wrong_length') {
    icon = '📏';
    body =
      wordOf(country) === word ? (
        <>
          <b>{country.flag} {country.name}</b> gerçek bir ülke ama gizli ülke olamaz. Tek kelimelik {length} harfli
          ülkeler arasından tahmin etmelisin.
        </>
      ) : (
        <>
          Sanırım <b>{country.flag} {country.name}</b> demek istedin, ama o {wordOf(country).length} harfli. {length}{' '}
          harfli bir ülke dene.
        </>
      );
  } else {
    icon = '🌍';
    body = (
      <>
        <b>{word}</b> bir ülke ismine benzemiyor. Bu oyunun teması <b>ülkeler</b>.
        {dialog.offline && <span className="dialog-note"> (Yapay zekâ hakeme şu an ulaşılamıyor, yerel kontrol yapıldı.)</span>}
      </>
    );
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        ref={boxRef}
        className="dialog"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="dialog-icon">{icon}</div>
        <p>{body}</p>
        <p className="dialog-note">Bu deneme hakkından düşmedi.</p>
        <div className="dialog-actions">
          {isSuggestion ? (
            <>
              <button className="btn secondary" onClick={onClose}>
                Hayır
              </button>
              <button className="btn primary" onClick={onAccept}>
                Evet, {country.name} tahmin et
              </button>
            </>
          ) : (
            <button className="btn primary" onClick={onClose}>
              Tamam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
