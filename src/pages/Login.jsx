import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

export default function Login() {
  const emailRef = useRef();
  const pwRef = useRef();
  const { signup, login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  async function handle(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = pwRef.current.value;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await signup(email, password);
        toast.success("Registered successfully!");
        navigate('/Dashboard');  // Redirect to Dashboard after successful registration
      } else {
        await login(email, password);
        toast.success("Logged in successfully!");
        navigate('/Dashboard');  // Redirect to Dashboard after successful login
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <motion.form
        onSubmit={handle}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          {isRegister ? 'Register' : 'Login'}
        </h2>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm">Email</label>
            <input
              ref={emailRef}
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm">Password</label>
            <input
              ref={pwRef}
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </motion.button>
        </div>

        <p className="text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="ml-1 text-blue-600 hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </motion.form>
    </div>
  );
}
