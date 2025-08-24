import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-2 sm:px-6" style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <div className="w-full mx-auto">
        <h1 className="text-5xl font-serif font-bold mb-8 text-center gold-text2 drop-shadow-lg">Contact Us</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glassy-card p-8">
            <h2 className="text-3xl font-serif mb-6 gold-text">Get in Touch</h2>
            <p className="text-lg font-sans mb-6 text-[var(--text)]">
              Have questions about our platform or need assistance with your investment? Our dedicated support team is here to help you.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-serif mb-2 gold-text">Email</h3>
                <p className="font-sans">support@goldflux.com</p>
              </div>
              <div>
                <h3 className="text-lg font-serif mb-2 gold-text">Phone</h3>
                <p className="font-sans">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-lg font-serif mb-2 gold-text">Address</h3>
                <p className="font-sans">
                  123 Gold Street<br />
                  Financial District<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
          <div className="glassy-card p-8">
            <h2 className="text-3xl font-serif mb-6 gold-text">Send Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-sans mb-2 gold-text">Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-sans mb-2 gold-text">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-sans mb-2 gold-text">Subject</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-sans mb-2 gold-text">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans resize-none focus:ring-2 focus:ring-gold" placeholder="Your message..." />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222]">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 