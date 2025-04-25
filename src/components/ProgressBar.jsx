import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-4">
      {/* Label */}
      <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>

      {/* Bar Background */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        {/* Animated Foreground */}
        <motion.div
          className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
          animate={{ width: `${pct}%` }}
          initial={false}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
