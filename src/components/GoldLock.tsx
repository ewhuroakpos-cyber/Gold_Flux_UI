import React, { useState } from 'react';
import api from '../utils/api';
import { useToast } from './Toast';

interface GoldLockProps {
  goldHoldings: number;
  onRefresh: () => void;
}

const GoldLock: React.FC<GoldLockProps> = ({
  goldHoldings,
  onRefresh
}) => {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState<'30' | '90' | '180' | '365'>('90');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const lockPeriods = {
    '30': { days: 30, rate: 2.5, label: '30 Days' },
    '90': { days: 90, rate: 4.0, label: '90 Days' },
    '180': { days: 180, rate: 6.0, label: '180 Days' },
    '365': { days: 365, rate: 8.5, label: '1 Year' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      const selectedPeriod = lockPeriods[lockPeriod];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPeriod.days);

      await api.post('/user/gold-locks/', {
        amount: parseFloat(amount),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        interest_rate: selectedPeriod.rate
      });

      toast.showToast('Gold lock request submitted successfully!', 'success');
      setAmount('');
      onRefresh();
    } catch (error: any) {
      toast.showToast(error.response?.data?.error || 'Gold lock request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateInterest = () => {
    if (!amount) return 0;
    const selectedPeriod = lockPeriods[lockPeriod];
    const interest = (parseFloat(amount) * selectedPeriod.rate) / 100;
    return interest;
  };

  return (
    <div className="glassy-card p-8">
      <h2 className="text-2xl font-serif mb-6 gold-text">Gold Lock (Staking)</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lock Period Selection */}
        <div>
          <label className="block text-sm font-sans mb-3 gold-text">Lock Period</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(lockPeriods).map(([key, period]) => (
              <button
                key={key}
                type="button"
                onClick={() => setLockPeriod(key as any)}
                className={`p-4 rounded-xl font-sans font-semibold transition-colors ${
                  lockPeriod === key
                    ? 'gold-gradient-bg text-[#222]'
                    : 'border-2 border-gold text-gold'
                }`}
              >
                <div className="text-lg font-bold">{period.label}</div>
                <div className="text-sm">{period.rate}% APY</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-sans mb-2 gold-text">Amount to Lock (oz)</label>
          <input
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
            placeholder="Enter amount to lock"
            required
          />
        </div>

        {/* Current Holdings Display */}
        <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
          <h4 className="text-lg font-serif mb-2 gold-text">Available Gold</h4>
          <p className="text-2xl font-bold gold-text">{Number(goldHoldings)?.toFixed(4) || '0.0000'} oz</p>
          <p className="text-sm text-gray-400 mt-1">Available for locking</p>
        </div>

        {/* Lock Summary */}
        {amount && (
          <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
            <h4 className="text-lg font-serif mb-2 gold-text">Lock Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Lock Period:</span>
                <span className="gold-text">{lockPeriods[lockPeriod].label}</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Rate:</span>
                <span className="gold-text">{lockPeriods[lockPeriod].rate}% APY</span>
              </div>
              <div className="flex justify-between">
                <span>Amount to Lock:</span>
                <span className="gold-text">{amount} oz</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Earned:</span>
                <span className="gold-text">{calculateInterest().toFixed(4)} oz</span>
              </div>
              <div className="flex justify-between">
                <span>Total at Maturity:</span>
                <span className="gold-text">{(parseFloat(amount) + calculateInterest()).toFixed(4)} oz</span>
              </div>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
          <h4 className="text-lg font-serif mb-2 gold-text">Benefits</h4>
          <div className="text-sm space-y-2">
            <p>• Earn interest on your gold holdings</p>
            <p>• Higher rates for longer lock periods</p>
            <p>• Interest paid in gold</p>
            <p>• Automatic maturity and payout</p>
            <p>• No early withdrawal fees</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount || parseFloat(amount) > goldHoldings}
          className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Lock Gold'}
        </button>
      </form>
    </div>
  );
};

export default GoldLock; 