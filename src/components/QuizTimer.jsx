import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function QuizTimer({ seconds, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, onExpire]);

  const isLow = timeLeft <= 10;

  return (
    <motion.div
      className={`inline-block text-white px-4 py-2 rounded-full text-lg font-semibold shadow-md ${
        isLow ? 'bg-red-500' : 'bg-green-500'
      }`}
      animate={isLow ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.6, repeat: Infinity }}
    >
      ⏱️ Time Left: {timeLeft}s
    </motion.div>
  );
}
