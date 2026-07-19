import React from 'react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

const OFFSETS = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  amount = 0.2,
  once = true,
  className = '',
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, ...OFFSETS[direction] }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once, amount }}
    transition={{ duration, delay, ease: EASE }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerGroup = ({ children, className = '', stagger = 0.08, amount = 0.15, once = true, ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, amount }}
    variants={{ visible: { transition: { staggerChildren: stagger } } }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '', variant = 'up', ...props }) => {
  const hidden = variant === 'scale' ? { opacity: 0, scale: 0.85 } : { opacity: 0, ...OFFSETS[variant] };
  const visible = variant === 'scale' ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0, x: 0 };
  return (
    <motion.div
      variants={{ hidden, visible: { ...visible, transition: { duration: 0.55, ease: EASE } } }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
