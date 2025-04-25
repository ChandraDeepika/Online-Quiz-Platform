import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function QuestionForm({ onAdd }) {
  const [q, setQ] = useState('');
  const [opts, setOpts] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = async () => {
    if (!q.trim() || opts.some(opt => !opt.trim())) {
      alert("Please fill in the question and all options.");
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 300)); // Simulate async action
    onAdd({ question: q, options: opts, correct });

    setQ('');
    setOpts(['', '', '', '']);
    setCorrect(0);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-indigo-100 rounded-2xl shadow-md p-6 space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-1">
            📝 Question
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter your question"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-700">✏️ Options</label>
          {opts.map((opt, i) => (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${correct === i ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...opts];
                  newOpts[i] = e.target.value;
                  setOpts(newOpts);
                }}
                placeholder={`Option ${i + 1}`}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="radio"
                name="correct"
                checked={correct === i}
                onChange={() => setCorrect(i)}
                className="accent-purple-600 cursor-pointer scale-125"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            type="button"
            onClick={handleAddQuestion}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            {loading ? 'Adding Question...' : '➕ Add Question'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
