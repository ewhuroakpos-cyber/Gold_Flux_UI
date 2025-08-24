import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../components/Toast';

interface DepositRequest {
  id: number;
  amount: number;
  currency: 'BTC' | 'USDT' | 'ETH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created: string;
  approved_at?: string;
  approved_by?: string;
}

const Deposit: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'BTC' | 'USDT' | 'ETH'>('USDT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setFetchError('');
    try {
      const response = await api.get('/user/deposits/');
      setDeposits(response.data);
    } catch (error: any) {
      setFetchError(error.response?.data?.error || 'Error fetching deposits');
      setDeposits([]);
      toast.showToast(error.response?.data?.error || 'Error fetching deposits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/user/deposits/', {
        amount: parseFloat(amount),
        currency
      });
      await fetchDeposits();
      setAmount('');
      toast.showToast('Deposit request submitted!', 'success');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Deposit request failed');
      toast.showToast(error.response?.data?.error || 'Deposit request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-600';
      case 'REJECTED': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  if (fetchError) {
    return <ErrorMessage message={fetchError} onRetry={fetchDeposits} />;
  }

  return (
    <div className="space-y-8 min-h-screen py-8 px-2 sm:px-6" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <h1 className="text-4xl font-serif mb-8 gold-text drop-shadow-lg">Deposit Funds</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glassy-card p-8">
          <h2 className="text-2xl font-serif mb-6 gold-text">New Deposit Request</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Amount</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold" placeholder="Enter amount" required />
            </div>
            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as 'BTC' | 'USDT' | 'ETH')} className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold">
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
            </div>
            <button type="submit" disabled={loading || !amount} className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222] disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Deposit Request'}</button>
            {error && <ErrorMessage message={error} />}
          </form>
        </div>
        <div className="glassy-card p-8">
          <h2 className="text-2xl font-serif mb-6 gold-text">My Deposit Requests</h2>
          <div className="space-y-4">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="border border-gold rounded-xl p-4 bg-black/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-sans font-semibold gold-text">{deposit.amount} {deposit.currency}</p>
                    <p className="text-sm text-gray-400 font-sans">{new Date(deposit.created).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-sans font-semibold ${getStatusColor(deposit.status)}`}>{deposit.status}</span>
                </div>
                {deposit.approved_at && (<p className="text-sm text-gray-400 font-sans">{deposit.status === 'APPROVED' ? 'Approved' : 'Rejected'} on {new Date(deposit.approved_at).toLocaleDateString()}{deposit.approved_by && ` by ${deposit.approved_by}`}</p>)}
              </div>
            ))}
            {deposits.length === 0 && (<div className="text-center py-8 text-gray-400"><p className="font-sans">No deposit requests found</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit; 