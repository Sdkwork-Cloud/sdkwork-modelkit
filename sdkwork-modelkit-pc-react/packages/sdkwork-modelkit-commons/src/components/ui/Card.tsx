import React from 'react';
import { motion } from 'motion/react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-surface border border-divider hover:border-divider-strong rounded p-4 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}
