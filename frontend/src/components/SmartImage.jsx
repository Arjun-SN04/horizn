import React, { useLayoutEffect, useRef, useState } from 'react';
import { imageProps } from '@/lib/image';
import { cn } from '@/lib/utils';

// URLs that have finished loading this session. Images in here are shown
// immediately (no fade) when a page re-mounts, so they don't look like they reload.
const loadedUrls = new Set();

// <img> that requests a right-sized version of the image and fades in the first time it loads.
// `width` is roughly how wide the image is displayed, in CSS pixels.
export const SmartImage = ({ src, width = 600, className, eager = false, onLoad, ...props }) => {
  const sized = imageProps(src, width);
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(() => loadedUrls.has(sized.src));
  // Fade only when the image wasn't ready at mount; cached images appear instantly.
  const [fade, setFade] = useState(() => !loadedUrls.has(sized.src));

  // In the browser cache already? It's complete before paint, so skip the fade.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      loadedUrls.add(sized.src);
      setFade(false);
      setLoaded(true);
    }
  }, [sized.src]);

  return (
    <img
      ref={imgRef}
      {...sized}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      onLoad={(e) => { loadedUrls.add(sized.src); setLoaded(true); onLoad?.(e); }}
      onError={() => setLoaded(true)}
      className={cn(
        'bg-surface-container',
        fade && 'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      {...props}
    />
  );
};
