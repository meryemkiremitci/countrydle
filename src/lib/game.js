export const MAX_GUESSES = 6;

// Classic Wordle scoring, handling repeated letters correctly.
export function scoreGuess(guess, answer) {
  const result = Array(guess.length).fill('absent');
  const remaining = {};
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) result[i] = 'correct';
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] !== 'correct' && remaining[guess[i]]) {
      result[i] = 'present';
      remaining[guess[i]]--;
    }
  }
  return result;
}

const EARTH_RADIUS_KM = 6371;
const MAX_DISTANCE_KM = 20_037; // half of Earth's circumference
const toRad = (deg) => (deg * Math.PI) / 180;

export function distanceKm([lat1, lon1], [lat2, lon2]) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

// Initial compass bearing from -> to, as one of 8 arrows.
export function directionArrow([lat1, lon1], [lat2, lon2]) {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  return ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'][Math.round(bearing / 45) % 8];
}

export function proximityPercent(km) {
  return Math.round(Math.max(0, 1 - km / MAX_DISTANCE_KM) * 100);
}

export function hint(from, to) {
  const km = distanceKm(from.latlng, to.latlng);
  return { km: Math.round(km), arrow: directionArrow(from.latlng, to.latlng), proximity: proximityPercent(km) };
}

// Blue (far) -> red (close); realistic proximities are in the 40-100% range.
export function proximityColor(proximity) {
  const t = Math.min(1, Math.max(0, (proximity - 40) / 60));
  return `hsl(${Math.round(220 * (1 - t))}, 80%, 55%)`;
}
