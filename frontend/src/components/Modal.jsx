import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const getMaxWidth = (cls) => {
  if (!cls) return '32rem';
  if (cls.includes('max-w-sm')) return '24rem';
  if (cls.includes('max-w-md')) return '28rem';
  if (cls.includes('max-w-lg')) return '32rem';
  if (cls.includes('max-w-xl')) return '36rem';
  if (cls.includes('max-w-2xl')) return '42rem';
  if (cls.includes('max-w-4xl')) return '56rem';
  return '32rem';
};

export const Modal = ({ open, onClose, title, children, maxWidthClass = 'max-w-lg' }) => {
  const maxWidth = getMaxWidth(maxWidthClass);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{ width: '100%', maxWidth }}
            className="relative shrink-0 my-auto max-h-[85vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-2xl p-6 md:p-8 box-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
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
};
