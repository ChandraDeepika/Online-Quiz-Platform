// QuizCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import QuestionForm from '../components/QuestionForm';
import toast from 'react-hot-toast';

export default function QuizCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(300); // Default duration (5 minutes)
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  const handleAddQuestion = (newQuestion) => {
    if (
      newQuestion.question.trim() &&
      newQuestion.options.every((opt) => opt.trim() !== '')
    ) {
      setQuestions((prev) => [...prev, newQuestion]);
      toast.success('Question added!');
    } else {
      toast.error('Please fill in the question and all options.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) {
      toast.error('Please enter a title and at least one question.');
      return;
    }
    try {
      setPublishing(true);
      const docRef = await addDoc(collection(db, 'quizzes'), {
        title,
        description,
        questions,
        duration, // Store the duration in Firestore
        createdAt: Date.now(),
      });
      toast.success('Quiz published successfully!');
      navigate(`/quiz/${docRef.id}`);
    } catch (error) {
      toast.error('Failed to publish quiz.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Create a New Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
        />
        <textarea
          placeholder="Quiz Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
        ></textarea>

        <QuestionForm onAdd={handleAddQuestion} />

        <div className="space-y-2">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Q{idx + 1}: {q.question}</p>
                <ul className="list-disc ml-5">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Duration Input */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm">Quiz Duration (in seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="10"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
          />
          <small className="text-gray-500">Duration in seconds. Example: 300 = 5 minutes.</small>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || questions.length === 0 || publishing}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {publishing ? 'Publishing...' : 'Publish Quiz'}
        </button>
      </form>
    </div>
  );
}
