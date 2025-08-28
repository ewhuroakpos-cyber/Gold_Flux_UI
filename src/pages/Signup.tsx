import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import authService from '../services/authService';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
      await authService.signup({ username, email, password });
      showToast('Account created successfully!', 'success');
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
      className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4"
      style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
    >
      <div className="w-full max-w-lg glassy-card p-6 sm:p-8 rounded-2xl">
        <h1 className="text-3xl sm:text-4xl font-serif mb-6 text-center gold-text drop-shadow-lg">
          Sign Up
        </h1>
        <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:outline-none focus:ring-2 focus:ring-gold transition text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-center text-red-400 font-semibold text-sm sm:text-base">
            {error}
          </div>
        )}
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="underline gold-text">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
