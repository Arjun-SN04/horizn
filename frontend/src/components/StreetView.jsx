import React, { lazy, Suspense } from 'react';
import { Modal } from './Modal';

// mapillary-js is a large WebGL library — keep it out of the main bundle and
// only fetch it the moment someone actually opens Street View.
const StreetViewViewer = lazy(() => import('./StreetViewViewer'));

export const StreetView = ({ open, onClose, imageId, title }) => (
  <Modal open={open} onClose={onClose} title={title || 'Street View'} maxWidthClass="max-w-4xl">
    <div className="w-full rounded-xl overflow-hidden bg-black relative" style={{ height: '65vh' }}>
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        }
      >
        {imageId && <StreetViewViewer imageId={imageId} />}
      </Suspense>
    </div>
    <p className="text-on-surface-variant text-xs mt-3 mb-0">
      Street-level imagery from{' '}
      <a href="https://www.mapillary.com" target="_blank" rel="noreferrer" className="text-primary no-underline hover:underline">
        Mapillary
      </a>{' '}
      contributors, licensed CC BY-SA.
    </p>
  </Modal>
);
