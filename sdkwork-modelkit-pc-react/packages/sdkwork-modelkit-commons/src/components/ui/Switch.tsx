import React from 'react';
import { motion } from 'motion/react';

export function Switch({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div 
      className={`w-8 h-4 rounded-full cursor-pointer relative transition-colors ${checked ? 'bg-primary-main' : 'bg-gray-700'}`}
      onClick={() => onChange(!checked)}
    >
      <motion.div 
        layout 
        className={`absolute top-0.5 w-3 h-3 rounded-full ${checked ? 'bg-white' : 'bg-gray-400'}`}
        initial={false}
        animate={{ x: checked ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 700, damping: 40 }}
      />
    </div>
  );
}
