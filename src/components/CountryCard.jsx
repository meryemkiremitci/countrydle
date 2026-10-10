const REGIONS_TR = {
  Africa: 'Afrika',
  Americas: 'Amerika',
  Asia: 'Asya',
  Europe: 'Avrupa',
  Oceania: 'Okyanusya',
  Antarctic: 'Antarktika',
};

const fmt = (n) => (n == null ? '—' : n.toLocaleString('tr-TR'));
const capitalize = (s) => s && s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);

export default function CountryCard({ country, hint, isAnswer }) {
  if (!country) {
    return (
      <div className="card placeholder">
        Bir tahmin yaptığında ülkenin bilgileri burada görünecek. Önceki tahminlere tıklayarak bilgilerine tekrar
        bakabilirsin.
      </div>
    );
  }

  return (
    <div className={`card ${isAnswer ? 'answer' : ''}`}>
      <div className="card-head">
        <span className="card-flag">{country.flag}</span>
        <div>
          <h2>{country.name}</h2>
          <div className="card-sub">
            {capitalize(country.trName)} · {country.official}
          </div>
        </div>
      </div>
      {hint && !isAnswer && (
        <div className="card-hint">
          Hedef ülke buradan <b>{fmt(hint.km)} km</b> uzakta, yönü <b>{hint.arrow}</b> · yakınlık <b>%{hint.proximity}</b>
        </div>
      )}
      {isAnswer && <div className="card-hint win">Gizli ülke buydu!</div>}
      <dl>
        <dt>Başkent</dt>
        <dd>{country.capital || '—'}</dd>
        <dt>Bölge</dt>
        <dd>
          {REGIONS_TR[country.region] || country.region}
          {country.subregion ? ` · ${country.subregion}` : ''}
        </dd>
        <dt>Nüfus</dt>
        <dd>{fmt(country.population)}</dd>
        <dt>Yüzölçümü</dt>
        <dd>{fmt(Math.round(country.area))} km²</dd>
        <dt>Diller</dt>
        <dd>{country.languages.join(', ') || '—'}</dd>
        <dt>Para birimi</dt>
        <dd>{country.currencies.join(', ') || '—'}</dd>
      </dl>
    </div>
  );
}
