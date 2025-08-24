import React from 'react';
import LiveGoldChart from '../components/LiveGoldChart';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen md:pt-20 flex flex-col items-center justify-center" style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <div className="w-full text-center mb-12 glassy-card p-4" style={{ fontFamily: 'var(--font-serif)' }}>
        <p className="text-4xl md:text-5xl font-serif font-bold mb-6 gold-text drop-shadow-lg">
          Invest in Gold, Secure Your Future
        </p>
        <p className="text-lg md:text-xl font-sans mb-8 text-[var(--text)]">
          The premium platform for digital gold investment. Buy, sell, and lock gold with confidence. Enjoy luxury, security, and transparency.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
          <a href="/signup" className="px-8 py-3 rounded-2xl font-sans font-semibold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222]">Get Started</a>
          <a href="/login" className="px-8 py-3 rounded-2xl font-sans font-semibold border-2 border-gold text-lg text-gold hover:bg-gold hover:text-[#222] transition">Login</a>
        </div>
      </div>
      <div className="w-full glassy-card p-6 mb-8">
        <h2 className="text-2xl font-serif mb-4 gold-text">Live Gold Price</h2>
        <LiveGoldChart />
      </div>
    </div>
  );
};

export default Home; 