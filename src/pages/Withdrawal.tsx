import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../components/Toast';

interface WithdrawalRequest {
  id: number;
  amount: number;
  currency: 'BTC' | 'USDT' | 'ETH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created: string;
  approved_at?: string;
  approved_by?: string;
}

interface WithdrawalProps {
  userWallet: {
    balance: number;
    address?: string;
  };
  onRefresh: () => void;
}

const Withdrawal: React.FC<WithdrawalProps> = ({ userWallet, onRefresh }) => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'BTC' | 'USDT' | 'ETH'>('USDT');
  const [walletAddress, setWalletAddress] = useState(userWallet?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setFetchError('');
    try {
      const response = await api.get('/user/withdrawals/');
      setWithdrawals(response.data);
    } catch (error: any) {
      setFetchError(`Failed to load withdrawals. Please try again. ${error.message}`);
      setWithdrawals([]);
      toast.showToast('Failed to load withdrawals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/user/withdrawals/', {
        amount: parseFloat(amount),
        currency,
        address: walletAddress || userWallet.address // fallback if no saved address
      });
      await fetchWithdrawals();
      setAmount('');
      toast.showToast('Withdrawal request submitted!', 'success');
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Withdrawal request failed');
      toast.showToast(error.response?.data?.error || 'Withdrawal request failed', 'error');
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

  return (
    <div className="space-y-8 min-h-screen py-8 px-2 sm:px-6" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <h1 className="text-4xl font-serif mb-8 gold-text drop-shadow-lg">Withdraw Funds</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glassy-card p-8">
          <h2 className="text-2xl font-serif mb-6 gold-text">New Withdrawal Request</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
                placeholder="Enter or use saved address"
              />
            </div>

            <div>
              <label className="block text-sm font-sans mb-2 gold-text">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'BTC' | 'USDT' | 'ETH')}
                className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222] disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>

        {/* Withdrawal List */}
        <div className="glassy-card p-8">
          <h2 className="text-2xl font-serif mb-6 gold-text">My Withdrawal Requests</h2>
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="border border-gold rounded-xl p-4 bg-black/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-sans font-semibold gold-text">{withdrawal.amount} {withdrawal.currency}</p>
                    <p className="text-sm text-gray-400 font-sans">{new Date(withdrawal.created).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-sans font-semibold ${getStatusColor(withdrawal.status)}`}>{withdrawal.status}</span>
                </div>
                {withdrawal.approved_at && (
                  <p className="text-sm text-gray-400 font-sans">
                    {withdrawal.status === 'APPROVED' ? 'Approved' : 'Rejected'} on {new Date(withdrawal.approved_at).toLocaleDateString()}
                    {withdrawal.approved_by && ` by ${withdrawal.approved_by}`}
                  </p>
                )}
              </div>
            ))}
            {withdrawals.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="font-sans">No withdrawal requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
