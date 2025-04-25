// Updated QuizAttempt.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import QuizTimer from '../components/QuizTimer';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';

export default function QuizAttempt() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'quizzes', id));
        if (docSnap.exists()) {
          setQuiz(docSnap.data());
        } else {
          toast.error('Quiz not found.');
        }
      } catch (error) {
        toast.error('Failed to load quiz.');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleExpire = () => {
    toast.error('Time up! Submitting...');
    handleSubmit();
  };

  const handleChange = (qi, oi) => {
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  const handleSubmit = async () => {
    if (!quiz || submitted) return;
    let sc = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) sc++;
    });
    setScore(sc);
    setSubmitted(true);

    try {
      await addDoc(collection(db, 'results'), {
        quizId: id,
        score: sc,
        userId: currentUser?.uid,
        name: name || currentUser?.displayName || 'Anonymous',
        date: Date.now(),
        quizTitle: quiz.title,
      });
      toast.success('Submitted successfully!');
    } catch {
      toast.error('Submission failed.');
    }
  };

  if (!quiz) return <p className="text-center text-gray-600 mt-10">Loading quiz...</p>;

  if (score !== null)
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-xl">Your Score: {score} / {quiz.questions.length}</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-gray-600">{quiz.description}</p>
      </div>

      <QuizTimer seconds={quiz.duration} onExpire={handleExpire} />
      <ProgressBar current={Object.keys(answers).length} total={quiz.questions.length} />

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6 mt-6">
        {/* Ask for user name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {quiz.questions.map((q, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="font-semibold">Q{i + 1}. {q.question}</p>
            <div className="mt-2 space-y-2">
              {q.options.map((opt, j) => (
                <label key={j} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${i}`}
                    onChange={() => handleChange(i, j)}
                    checked={answers[i] === j}
                    required
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
