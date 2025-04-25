import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react'; // optional loading icon

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      const res = await getDocs(collection(db, 'quizzes'));
      setQuizzes(res.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">📚 Your Quizzes</h2>
        <Link
          to="/create"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
        >
          ➕ Create New Quiz
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 flex justify-center items-center space-x-2">
          <Loader className="animate-spin" />
          <span>Loading quizzes...</span>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center text-gray-500 italic mt-20">
          You haven't created any quizzes yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q, i) => (
            <motion.div
              key={q.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {q.title || `Untitled Quiz ${i + 1}`}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {q.description || 'No description provided.'}
              </p>
              <Link
                to={`/quiz/${q.id}`}
                className="inline-block mt-auto text-indigo-600 font-medium hover:underline"
              >
                🚀 View Quiz
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
