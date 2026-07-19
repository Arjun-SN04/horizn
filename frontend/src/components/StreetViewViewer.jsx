import React, { useEffect, useRef } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

const ACCESS_TOKEN = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN;

export default function StreetViewViewer({ imageId }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!imageId || !containerRef.current) return;
    viewerRef.current = new Viewer({
      accessToken: ACCESS_TOKEN,
      container: containerRef.current,
      imageId,
    });
    return () => {
      viewerRef.current?.remove();
      viewerRef.current = null;
    };
  }, [imageId]);

  return <div ref={containerRef} className="w-full h-full" />;
}
