import React, { useState } from 'react';
import api from '../utils/api';
import { useToast } from './Toast';

interface DepositWithdrawalProps {
  userBalance: number;
  onRefresh: () => void;
}

const DepositWithdrawal: React.FC<DepositWithdrawalProps> = ({
  userBalance,
  onRefresh
}) => {
  const [type, setType] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'BTC' | 'USDT' | 'ETH'>('USDT');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      const endpoint = type === 'DEPOSIT' ? '/user/deposits/' : '/user/withdrawals/';
      await api.post(endpoint, {
        amount: parseFloat(amount),
        currency
      });

      toast.showToast(`${type} request submitted successfully!`, 'success');
      setAmount('');
      onRefresh();
    } catch (error: any) {
      toast.showToast(error.response?.data?.error || `${type} request failed`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glassy-card p-8">
      <h2 className="text-2xl font-serif mb-6 gold-text">Deposit & Withdrawal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-sans mb-3 gold-text">Transaction Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType('DEPOSIT')}
              className={`px-6 py-3 rounded-xl font-sans font-semibold transition-colors ${
                type === 'DEPOSIT' 
                  ? 'bg-green-600 text-white' 
                  : 'border-2 border-green-600 text-green-600'
              }`}
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setType('WITHDRAWAL')}
              className={`px-6 py-3 rounded-xl font-sans font-semibold transition-colors ${
                type === 'WITHDRAWAL' 
                  ? 'bg-red-600 text-white' 
                  : 'border-2 border-red-600 text-red-600'
              }`}
            >
              Withdrawal
            </button>
          </div>
        </div>

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-sans mb-2 gold-text">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
          >
            <option value="USDT">USDT (Tether)</option>
            <option value="BTC">BTC (Bitcoin)</option>
            <option value="ETH">ETH (Ethereum)</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-sans mb-2 gold-text">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
            placeholder={`Enter ${type.toLowerCase()} amount`}
            required
          />
        </div>

        {/* Current Balance Display */}
        <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
          <h4 className="text-lg font-serif mb-2 gold-text">Account Balance</h4>
          <p className="text-2xl font-bold gold-text">${userBalance.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">Available for {type.toLowerCase()}</p>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
          <h4 className="text-lg font-serif mb-2 gold-text">Instructions</h4>
          {type === 'DEPOSIT' ? (
            <div className="text-sm space-y-2">
              <p>• Send {currency} to the address provided after submission</p>
              <p>• Minimum deposit: $10 USD equivalent</p>
              <p>• Processing time: 1-3 confirmations</p>
              <p>• Funds will be credited to your account balance</p>
            </div>
          ) : (
            <div className="text-sm space-y-2">
              <p>• Withdrawal requests are processed within 24 hours</p>
              <p>• Minimum withdrawal: $50 USD equivalent</p>
              <p>• Ensure you have sufficient balance</p>
              <p>• Provide correct wallet address</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222] disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Submit ${type} Request`}
        </button>
      </form>
    </div>
  );
};

export default DepositWithdrawal; 