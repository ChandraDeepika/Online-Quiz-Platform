import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

// --- Inline Avatar Component ---
const Avatar = ({ src, name }) => {
  const [imageError, setImageError] = useState(false);
  const fallback = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold overflow-hidden">
      {!imageError && src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('All');

  useEffect(() => {
    async function fetchQuizzes() {
      const quizDocs = await getDocs(collection(db, 'quizzes'));
      const quizList = quizDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizList);
    }
    fetchQuizzes();
  }, []);

  useEffect(() => {
    async function fetchLeaders() {
      const resultsRef = collection(db, 'results');
      const q = selectedQuiz !== 'All' ? query(resultsRef, where('quizId', '==', selectedQuiz)) : resultsRef;
      const snapshot = await getDocs(q);

      const leaderboard = snapshot.docs.map(doc => doc.data())
        .filter(r => r.name && typeof r.score === 'number')
        .sort((a, b) => b.score - a.score);

      setLeaders(leaderboard);
    }
    fetchLeaders();
  }, [selectedQuiz]);

  const getMaxScore = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.questions?.length || 0 : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 py-10"
    >
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">🏆 Leaderboard</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Quiz:</label>
        <select
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
          className="w-full max-w-xs p-2 border rounded-lg shadow-sm"
        >
          <option value="All">All</option>
          {quizzes.map(q => (
            <option key={q.id} value={q.id}>{q.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 space-y-4">
        {leaders.length === 0 ? (
          <p className="text-gray-500 text-center">No quiz attempts found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {leaders.map((user, idx) => {
              const maxScore = getMaxScore(user.quizId);
              return (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ease-in-out ${
                    idx === 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : idx === 1
                      ? 'bg-gray-200 text-gray-700'
                      : idx === 2
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg">#{idx + 1}</span>
                    <Avatar
                      name={user.name}
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    />
                    <span className="font-semibold text-md">{user.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg">
                      {user.score} {maxScore ? `/ ${maxScore}` : ''}
                    </span>
                    {idx === 0 && <Crown className="inline ml-2 text-yellow-500" size={20} />}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
