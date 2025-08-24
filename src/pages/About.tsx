import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-2 sm:px-6" style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <div className="w-full mx-auto">
        <h1 className="text-5xl font-serif font-bold mb-8 text-center gold-text2 drop-shadow-lg">About Gold Flux</h1>
        <div className="glassy-card p-8 mb-8">
          <h2 className="text-3xl font-serif mb-6 gold-text">Our Mission</h2>
          <p className="text-lg font-sans leading-relaxed mb-6 text-[var(--text)]">
            Gold Flux is the premier digital gold investment platform, designed to make gold investment accessible, secure, and transparent for everyone. We combine traditional gold investment wisdom with cutting-edge technology to provide a seamless investment experience.
          </p>
          <p className="text-lg font-sans leading-relaxed text-[var(--text)]">
            Our platform allows you to buy, sell, and lock gold with confidence, backed by real-time market data and secure blockchain technology. Whether you're a seasoned investor or just starting your gold investment journey, Gold Flux provides the tools and security you need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glassy-card p-6">
            <h3 className="text-xl font-serif mb-4 gold-text">Security</h3>
            <p className="font-sans text-[var(--text)]">Your investments are protected by enterprise-grade security measures and transparent blockchain technology.</p>
          </div>
          <div className="glassy-card p-6">
            <h3 className="text-xl font-serif mb-4 gold-text">Transparency</h3>
            <p className="font-sans text-[var(--text)]">Real-time pricing, instant transactions, and complete visibility into your gold holdings and transactions.</p>
          </div>
          <div className="glassy-card p-6">
            <h3 className="text-xl font-serif mb-4 gold-text">Accessibility</h3>
            <p className="font-sans text-[var(--text)]">Invest in gold with as little as $1, with support for multiple cryptocurrencies and traditional payment methods.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 