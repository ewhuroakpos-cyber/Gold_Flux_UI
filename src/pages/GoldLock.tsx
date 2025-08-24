import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../components/Toast';

interface GoldLock {
  id: number;
  amount: number;
  start_date: string;
  end_date: string;
  interest_rate: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MATURED';
  matured: boolean;
  created: string;
  approved_at?: string;
  approved_by?: string;
}

const GoldLock: React.FC = () => {
  const [goldLocks, setGoldLocks] = useState<GoldLock[]>([]);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('30');
  const [interestRate, setInterestRate] = useState('5.0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchGoldLocks();
  }, []);

  const fetchGoldLocks = async () => {
    setFetchError('');
    try {
      const response = await api.get('/user/gold-locks/');
      setGoldLocks(response.data);
    } catch (error: any) {
      setFetchError('Failed to load gold locks. Please try again.');
      setGoldLocks([]);
      toast.showToast('Failed to load gold locks.', 'error');
      console.error('Error fetching gold locks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(period));
    try {
      await api.post('/user/gold-locks/', {
        amount: parseFloat(amount),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        interest_rate: parseFloat(interestRate)
      });
      await fetchGoldLocks();
      setAmount('');
      toast.showToast('Gold lock request submitted!', 'success');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Gold lock request failed');
      toast.showToast(error.response?.data?.error || 'Gold lock request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-600';
      case 'REJECTED': return 'bg-red-600';
      case 'MATURED': return 'bg-blue-600';
      default: return 'bg-yellow-600';
    }
  };

  return (
    <div className="space-y-8 min-h-screen py-8 px-2 sm:px-6" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <h1 className="text-4xl font-serif mb-8 gold-text drop-shadow-lg">Gold Lock Investment</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glassy-card p-8">
          <h2 className="text-2xl font-serif mb-6 gold-text">New Gold Lock Request</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Amount (oz)</label>
              <input type="number" step="0.0001" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold" placeholder="Enter amount" required />
            </div>
            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Lock Period (days)</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold">
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Interest Rate (%)</label>
              <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold" placeholder="Enter interest rate" required />
            </div>
            <button type="submit" disabled={loading || !amount || !period || !interestRate} className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222] disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Gold Lock Request'}</button>
            {error && <div className="text-red-400 font-semibold">{error}</div>}
          </form>
        </div>
        <div className="glassy-card p-8">
          <h2 className="text-2xl font-serif mb-6 gold-text">My Gold Lock Requests</h2>
          <div className="space-y-4">
            {goldLocks.map((lock) => (
              <div key={lock.id} className="border border-gold rounded-xl p-4 bg-black/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-sans font-semibold gold-text">{lock.amount.toFixed(4)} oz</p>
                    <p className="text-sm text-gray-400 font-sans">{lock.interest_rate}% for {Math.ceil((new Date(lock.end_date).getTime() - new Date(lock.start_date).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                    <p className="text-sm text-gray-400 font-sans">Created: {new Date(lock.created).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-sans font-semibold ${getStatusColor(lock.status)}`}>{lock.status}</span>
                </div>
                {lock.approved_at && (<p className="text-sm text-gray-400 font-sans">{lock.status === 'APPROVED' ? 'Approved' : 'Rejected'} on {new Date(lock.approved_at).toLocaleDateString()}{lock.approved_by && ` by ${lock.approved_by}`}</p>)}
                {lock.matured && (<p className="text-sm text-green-400 font-sans font-semibold">✓ Matured on {new Date(lock.end_date).toLocaleDateString()}</p>)}
              </div>
            ))}
            {goldLocks.length === 0 && (<div className="text-center py-8 text-gray-400"><p className="font-sans">No gold lock requests found</p></div>)}
            {fetchError && <ErrorMessage message={fetchError} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldLock; 