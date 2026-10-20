// Rewrites remote image URLs so each host serves a right-sized, compressed version.
// Supports Unsplash, Cloudinary and Wikimedia Commons; other URLs pass through unchanged.

// Wikimedia only serves (and caches) these thumbnail widths quickly.
const WIKI_STEPS = [250, 330, 500, 960, 1280, 1920];

const wikiFileFromUrl = (url) => {
  const m = url.match(/commons\.wikimedia\.org\/wiki\/Special:FilePath\/([^?#]+)/i);
  return m ? decodeURIComponent(m[1]).replace(/ /g, '_') : null;
};

const sizeImage = (url, width) => {
  if (!url || typeof url !== 'string' || url.startsWith('blob:') || url.startsWith('data:')) return url;
  try {
    if (url.includes('images.unsplash.com') || url.includes('plus.unsplash.com')) {
      const u = new URL(url);
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', '70');
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.delete('ixlib');
      return u.toString();
    }

    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      // Drop any existing transformation, then add ours.
      return url.replace(/\/upload\/(?:[a-z]_[^/]+\/)*/, `/upload/f_auto,q_auto,c_limit,w_${width}/`);
    }

    const file = wikiFileFromUrl(url);
    if (file && /\.(jpe?g|png|gif|webp)$/i.test(file)) {
      // Direct thumbnail URL skips two redirects on commons.wikimedia.org.
      const hash = md5(file);
      const step = WIKI_STEPS.find((s) => s >= width) || WIKI_STEPS[WIKI_STEPS.length - 1];
      const name = encodeURIComponent(file);
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0, 2)}/${name}/${step}px-${name}`;
    }
  } catch {
    /* fall through to original URL */
  }
  return url;
};

export const imageUrl = sizeImage;

// src + srcSet for a given display width (1x and 2x screens).
export const imageProps = (url, width) => {
  const src = sizeImage(url, width);
  const hiDpi = sizeImage(url, width * 2);
  return src === hiDpi || src === url ? { src } : { src, srcSet: `${src} 1x, ${hiDpi} 2x` };
};

// ── minimal MD5 (needed for Wikimedia thumbnail paths) ────────────────
function md5(str) {
  const bytes = new TextEncoder().encode(str);
  const len = bytes.length;
  const words = new Array((((len + 8) >> 6) + 1) * 16).fill(0);
  for (let i = 0; i < len; i++) words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  words[len >> 2] |= 0x80 << ((len % 4) * 8);
  words[words.length - 2] = len * 8;

  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0);
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  let [a0, b0, c0, d0] = [0x67452301, 0xefcdab89 | 0, 0x98badcfe | 0, 0x10325476];

  for (let i = 0; i < words.length; i += 16) {
    let [a, b, c, d] = [a0, b0, c0, d0];
    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) { f = (b & c) | (~b & d); g = j; }
      else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16; }
      else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * j) % 16; }
      const tmp = d;
      d = c;
      c = b;
      const sum = (a + f + K[j] + words[i + g]) | 0;
      const s = S[(j >> 4) * 4 + (j % 4)];
      b = (b + ((sum << s) | (sum >>> (32 - s)))) | 0;
      a = tmp;
    }
    a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
  }

  return [a0, b0, c0, d0]
    .map((n) => Array.from({ length: 4 }, (_, i) => ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join(''))
    .join('');
}
