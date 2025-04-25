import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';

export default function Analytics() {
  const [barData, setBarData] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('All');

  useEffect(() => {
    async function fetchQuizzes() {
      const quizDocs = await getDocs(collection(db, 'quizzes'));
      setQuizzes(quizDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchQuizzes();
  }, []);

  useEffect(() => {
    async function fetchResults() {
      const resultsRef = collection(db, 'results');
      const resultsQuery = selectedQuiz !== 'All'
        ? query(resultsRef, where('quizId', '==', selectedQuiz))
        : resultsRef;
      const resultDocs = await getDocs(resultsQuery);
      const rawResults = resultDocs.docs.map(doc => doc.data());

      // Score Distribution
      const scoreMap = {};
      rawResults.forEach(({ score }) => {
        if (typeof score === 'number') {
          scoreMap[score] = (scoreMap[score] || 0) + 1;
        }
      });

      const formattedData = Object.entries(scoreMap).map(([score, count]) => ({
        score: `Score ${score}`,
        students: count
      }));
      setBarData(formattedData);

      // Stats
      const scores = rawResults.map(r => r.score).filter(score => typeof score === 'number');
      setTotalAttempts(scores.length);
      setAverageScore(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length || 0));
    }
    fetchResults();
  }, [selectedQuiz]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-4 py-10 space-y-12"
    >
      {/* Quiz Selector */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatsCard title="Total Attempts" value={totalAttempts} icon="🧾" />
        <StatsCard title="Average Score" value={averageScore} icon="📊" />
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">🎯 Score Distribution</h2>
        {barData.length === 0 ? (
          <p className="text-gray-500 text-center">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="students" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
