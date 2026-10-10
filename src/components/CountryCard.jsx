const fmt = (n) => (n == null ? '—' : n.toLocaleString('en-US'));

export default function CountryCard({ country, hint, isAnswer }) {
  if (!country) {
    return (
      <div className="card placeholder">
        Make a guess to see the country's details here. Click a previous guess to view it again.
      </div>
    );
  }

  return (
    <div className={`card ${isAnswer ? 'answer' : ''}`}>
      <div className="card-head">
        <span className="card-flag">{country.flag}</span>
        <div>
          <h2>{country.name}</h2>
          <div className="card-sub">{country.official}</div>
        </div>
      </div>
      {hint && !isAnswer && (
        <div className="card-hint">
          The secret country is <b>{fmt(hint.km)} km</b> away, direction <b>{hint.arrow}</b> · proximity <b>{hint.proximity}%</b>
        </div>
      )}
      {isAnswer && <div className="card-hint win">That was the secret country!</div>}
      <dl>
        <dt>Capital</dt>
        <dd>{country.capital || '—'}</dd>
        <dt>Region</dt>
        <dd>
          {country.region}
          {country.subregion ? ` · ${country.subregion}` : ''}
        </dd>
        <dt>Population</dt>
        <dd>{fmt(country.population)}</dd>
        <dt>Area</dt>
        <dd>{fmt(Math.round(country.area))} km²</dd>
        <dt>Languages</dt>
        <dd>{country.languages.join(', ') || '—'}</dd>
        <dt>Currency</dt>
        <dd>{country.currencies.join(', ') || '—'}</dd>
      </dl>
    </div>
  );
}
