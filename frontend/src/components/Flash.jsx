import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Flash = () => {
  const { flash, clearFlash } = useAuth();

  useEffect(() => {
    if (flash.success || flash.error) {
      const timer = setTimeout(clearFlash, 3500);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const kind = flash.success ? 'success' : flash.error ? 'error' : null;
  const message = flash.success || flash.error;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-999 flex flex-col gap-2 min-w-75 max-w-105 w-[90%] pointer-events-none">
      <AnimatePresence>
        {kind && (
          <motion.div
            key={kind + message}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3.5 bg-card border border-border rounded-2xl shadow-lg"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${kind === 'success' ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
              {kind === 'success' ? (
                <CheckCircle2 className="text-emerald-500 size-4" />
              ) : (
                <AlertCircle className="text-destructive size-4" />
              )}
            </div>
            <span className={`text-sm font-medium flex-1 ${kind === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
              {message}
            </span>
            <button onClick={clearFlash} className="bg-transparent border-0 cursor-pointer text-muted-foreground p-0 shrink-0">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
