import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => (
  <div className={`flex flex-col items-center justify-center h-screen ${className}`} style={{ background: 'var(--bg)', color: 'var(--text)' }}>
    <div className="text-red-500 font-bold text-lg mb-4 bg-[var(--card)] px-6 py-4 rounded-xl shadow-gold border-2 border-red-400">
      {message}
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 rounded-xl gold-gradient-bg text-[#222] font-bold shadow-gold hover:scale-105 transition"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorMessage; 