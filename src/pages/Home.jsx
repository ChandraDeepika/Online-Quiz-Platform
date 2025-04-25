import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="home bg-gradient-to-r from-blue-500 to-indigo-600 text-white min-h-screen flex flex-col justify-center items-center"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-5xl font-extrabold text-center mb-6"
      >
        🎉 Interactive Quiz Platform
      </motion.h1>

      <motion.p
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-xl text-center mb-8 max-w-lg"
      >
        Test your knowledge with real-time quizzes and challenge friends. Join our community of learners!
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-indigo-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
      >
        <Link
          to="/login"
          className="text-white text-lg font-semibold hover:underline"
        >
          Get Started
        </Link>
      </motion.div>
    </motion.div>
  );
}
