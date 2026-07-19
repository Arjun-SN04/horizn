import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Modal = ({ open, onClose, title, children, maxWidthClass = 'max-w-lg' }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className={`relative w-full ${maxWidthClass} max-h-[85vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-2xl p-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-heading text-headline-md text-on-surface">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
