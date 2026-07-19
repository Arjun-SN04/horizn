const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Nominatim (OpenStreetMap's free geocoding service) requires a descriptive
// User-Agent identifying the app per its usage policy — no API key needed.
module.exports.geocodeLocation = async (query) => {
  const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Horizn-App/1.0 (listing geocoding)' },
  });
  const results = await response.json();

  if (!results.length) return null;
  const { lon, lat } = results[0];
  return { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] };
};
