import React, { useState } from 'react';
import { imageProps } from '@/lib/image';
import { cn } from '@/lib/utils';

// <img> that requests a right-sized version of the image and fades in once loaded.
// `width` is roughly how wide the image is displayed, in CSS pixels.
export const SmartImage = ({ src, width = 600, className, eager = false, onLoad, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      {...imageProps(src, width)}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
      onError={() => setLoaded(true)}
      className={cn('bg-surface-container transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0', className)}
      {...props}
    />
  );
};
