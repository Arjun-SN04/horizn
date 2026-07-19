import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Heart, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SPARKLE_COUNT = 5;
const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
  const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
  return { id: i, x: Math.cos(angle) * 22, y: Math.sin(angle) * 22, delay: i * 0.04 };
});

export const ToastStack = () => {
  const { toasts, removeToast } = useToast();
  const count = toasts.length;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-999 min-w-75 max-w-105 w-[90%] pointer-events-none">
      <div className="relative">
        <AnimatePresence initial={false}>
          {toasts.map((t, i) => {
            const depth = count - 1 - i; // 0 = newest, in front
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.94 }}
                animate={{
                  opacity: Math.max(1 - depth * 0.28, 0.3),
                  y: depth * 10,
                  scale: Math.max(1 - depth * 0.06, 0.82),
                }}
                exit={{ opacity: 0, y: -16, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                style={{ zIndex: count - depth }}
                className="absolute inset-x-0 top-0 origin-top pointer-events-auto flex items-center gap-3 px-4 py-3.5 bg-card border border-border rounded-2xl shadow-lg"
              >
                <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  t.type === 'celebrate' ? 'bg-primary/15' : t.type === 'success' ? 'bg-emerald-500/10' : 'bg-destructive/10'
                }`}>
                  {t.type === 'celebrate' ? (
                    <>
                      <motion.span
                        initial={{ scale: 0.3, rotate: -15 }}
                        animate={{ scale: [0.3, 1.3, 1], rotate: 0 }}
                        transition={{ duration: 0.5, times: [0, 0.6, 1], ease: 'easeOut' }}
                      >
                        <Heart className="text-primary fill-primary size-4" />
                      </motion.span>
                      {sparkles.map((s) => (
                        <motion.span
                          key={s.id}
                          className="absolute size-1 rounded-full bg-primary"
                          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                          animate={{ opacity: 0, x: s.x, y: s.y, scale: 0 }}
                          transition={{ duration: 0.55, delay: s.delay, ease: [0.16, 1, 0.3, 1] }}
                        />
                      ))}
                    </>
                  ) : t.type === 'success' ? (
                    <CheckCircle2 className="text-emerald-500 size-4" />
                  ) : (
                    <AlertCircle className="text-destructive size-4" />
                  )}
                </div>
                <span className={`text-sm font-medium flex-1 ${
                  t.type === 'celebrate' ? 'text-primary' : t.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                }`}>
                  {t.message}
                </span>
                <button onClick={() => removeToast(t.id)} className="bg-transparent border-0 cursor-pointer text-muted-foreground p-0 shrink-0">
                  <X className="size-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
