const KEY = 'horizn:recentlyViewed';
const MAX = 8;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(listing) {
  if (!listing?._id) return;
  try {
    const existing = getRecentlyViewed().filter((l) => l._id !== listing._id);
    const entry = {
      _id: listing._id,
      title: listing.title,
      image: listing.image,
      location: listing.location,
      country: listing.country,
      price: listing.price,
    };
    localStorage.setItem(KEY, JSON.stringify([entry, ...existing].slice(0, MAX)));
  } catch {
    // localStorage unavailable — non-critical
  }
}
