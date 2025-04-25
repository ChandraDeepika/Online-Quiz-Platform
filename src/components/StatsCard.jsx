import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center space-y-2 hover:shadow-xl transition"
    >
      {/* Icon (optional) */}
      {icon && <div className="text-3xl text-blue-500">{icon}</div>}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>

      {/* Animated Value */}
      <div className="text-3xl font-bold text-green-600">
        <CountUp end={value} duration={1} />
      </div>
    </motion.div>
  );
}
