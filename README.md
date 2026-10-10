# Countrydle 🌍

Country-themed Wordle with an AI referee. Find the secret country in 6 guesses. Gemini recognizes misspelled
country names and asks "Did you mean ...?", and it rejects off-theme words without costing you a guess. Every guess
is marked on a map, along with its distance, direction and proximity to the secret country.

## How it works

Each guess is checked in this order (`src/lib/checkGuess.js`):

1. **Exact match:** `CHILE` is accepted directly if it is a valid country of the right length.
2. **Alternative names:** official names and alternative spellings (e.g. `BURMA` → Myanmar) are recognized locally.
3. **Simple typo:** a one-letter difference (e.g. `JAPAM` → Japan) is corrected locally, after asking you to confirm.
4. **Gemini:** if the checks above cannot decide, the word is sent to `/api/check`, which asks Gemini. The answer is
   restricted to real country names, so the model cannot invent one.
5. **If Gemini is unavailable** (no key, quota reached): a looser local match keeps the game running.

Letter coloring and distance calculations always run in code. The LLM is never used for them.

## Running locally

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# put your GEMINI_API_KEY in .env (https://aistudio.google.com/apikey)
npm run dev
```

Open http://localhost:5173. The game also works without a key; it then uses only the local checks.

## Deploying (Vercel, free)

1. Push the project to GitHub.
2. Sign in to [vercel.com](https://vercel.com) with GitHub → **Add New → Project** → select this repository.
   Vite projects are detected automatically; no build settings need to change.
3. Add `GEMINI_API_KEY` under **Environment Variables**, then **Deploy**.
4. Share the `xxx.vercel.app` address. Every later `git push` is deployed automatically.

## Project structure

```
api/check.js              Serverless function that calls Gemini (the key stays on the server)
api/_countries.js         Country name list (generated)
src/data/countries.json   Country data (generated)
src/lib/checkGuess.js     Guess checking flow (local → Gemini → fallback)
src/lib/countries.js      Country lookup, alternative names, typo matching
src/lib/game.js           Wordle scoring, distance/direction/proximity
src/components/           Board, keyboard, map, country card, dialogs
scripts/build-countries.mjs  Regenerates the country data: npm run build:countries
```

Data sources: [mledoze/countries](https://github.com/mledoze/countries) (ODbL), World Bank (population),
[world-atlas](https://github.com/topojson/world-atlas) / Natural Earth (borders), map © OpenStreetMap & CARTO.
