import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import authService from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login({ username, password });
      showToast('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4"
      style={{ color: "var(--text)", fontFamily: "var(--font-sans)" }}
    >
      <div className="w-full max-w-lg glassy-card p-6 sm:p-4 rounded-2xl">
        <h1 className="text-3xl sm:text-4xl font-serif mb-6 text-center gold-text drop-shadow-lg">
          Login
        </h1>
        <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:outline-none focus:ring-2 focus:ring-gold transition text-sm sm:text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:outline-none focus:ring-2 focus:ring-gold transition text-sm sm:text-base"
          />
          <button
            type="submit"
            className="w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-sans font-bold shadow-gold text-base sm:text-lg gold-gradient-bg hover:scale-105 transition text-[#222]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-center text-red-400 font-semibold text-sm sm:text-base">
            {error}
          </div>
        )}
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-300">
          Don't have an account?{" "}
          <a href="/signup" className="underline gold-text">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );

};

export default Login; 