import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from './Toast';

interface DepositWithdrawalProps {
  userBalance: number;
  onRefresh: () => void;
  user: { wallet?: { address?: string } }; // user.wallet.address expected
}

const DepositWithdrawal: React.FC<DepositWithdrawalProps> = ({
  userBalance,
  onRefresh,
  user
}) => {
  const [type, setType] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'BTC' | 'USDT' | 'ETH'>('USDT');
  const [loading, setLoading] = useState(false);
  const [depositReady, setDepositReady] = useState(false);
  const [userWallet, setUserWallet] = useState(user.wallet?.address || '');
  const [walletInput, setWalletInput] = useState('');
  const toast = useToast();

  const tokenAddresses: Record<string, string> = {
    BTC: '3HoXm6p1qvhtkLj8ZKxu6Vn5VFZXRpeKKm',
    USDT: '0x0DaCFA8314d44b246E8AbfF55795245eF3953167',
    ETH: '0xd311d0548456941E40091cb57eb10b6CEdcAC7F6',
  };
  const depositAddress = tokenAddresses[currency];

  // Save new wallet address
  const saveWallet = async (address: string) => {
    try {
      await api.post('/user/wallet', { address });
      setUserWallet(address);
      toast.showToast('Wallet address saved successfully!', 'success');
      return true;
    } catch (err) {
      toast.showToast('Failed to save wallet address', 'error');
      return false;
    }
  };

  // Submit deposit or withdrawal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    // Withdrawal flow with address logic
    if (type === 'WITHDRAWAL') {
      let withdrawalAddress = userWallet;

      // No saved address? Use input and save first
      if (!withdrawalAddress) {
        if (!walletInput) {
          return toast.showToast('Please enter a wallet address.', 'error');
        }
        const saved = await saveWallet(walletInput);
        if (!saved) return;
        withdrawalAddress = walletInput;
      }

      // Proceed with withdrawal using the selected address
      await processTransaction('/user/withdrawals/', { walletAddress: withdrawalAddress });
    } else {
      // Deposit flow
      await processTransaction('/user/deposits/');
    }
  };

  // Generic transaction handler
  const processTransaction = async (endpoint: string, extraData: Record<string, any> = {}) => {
    setLoading(true);
    try {
      await api.post(endpoint, {
        amount: parseFloat(amount),
        currency,
        ...extraData
      });

      toast.showToast(`${type} request submitted successfully!`, 'success');
      if (type === 'DEPOSIT') {
        setDepositReady(true);
      } else {
        setAmount('');
        onRefresh();
      }
    } catch (error: any) {
      toast.showToast(error.response?.data?.error || `${type} request failed`, 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDepositReady(false);
  }, [type, currency]);

  return (
    <div className="glassy-card p-8">
      <h2 className="text-2xl font-serif mb-6 gold-text">Deposit & Withdrawal</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm mb-3 gold-text">Transaction Type</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setType('DEPOSIT')}
              className={`px-6 py-3 rounded-xl ${type === 'DEPOSIT' ? 'bg-green-600 text-white' : 'border-2 border-green-600 text-green-600'}`}>
              Deposit
            </button>
            <button type="button" onClick={() => setType('WITHDRAWAL')}
              className={`px-6 py-3 rounded-xl ${type === 'WITHDRAWAL' ? 'bg-red-600 text-white' : 'border-2 border-red-600 text-red-600'}`}>
              Withdrawal
            </button>
          </div>
        </div>

        {/* Withdrawal address logic */}
        {type === 'WITHDRAWAL' && (
          <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
            {userWallet ? (
              <>
                <h4 className="text-lg font-serif mb-2 gold-text">Saved Wallet Address</h4>
                <p className="font-mono break-all text-gray-300">{userWallet}</p>
              </>
            ) : (
              <>
                <h4 className="text-lg font-serif mb-2 gold-text">Enter Wallet Address</h4>
                <input
                  type="text"
                  placeholder="Enter wallet address"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold mb-3 bg-transparent"
                />
              </>
            )}
          </div>
        )}

        {/* Currency Selection */}
        <div>
          <label className="block text-sm mb-2 gold-text">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] focus:ring-2 focus:ring-gold"
          >
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm mb-2 gold-text">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gold bg-transparent"
            placeholder={`Enter ${type.toLowerCase()} amount`}
            required
          />
        </div>

        {/* Balance Display */}
        <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
          <h4 className="text-lg mb-2 gold-text">Account Balance</h4>
          <p className="text-2xl font-bold gold-text">${userBalance.toLocaleString()}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-3 rounded-xl gold-gradient-bg text-[#222] font-bold"
        >
          {loading ? 'Processing...' : `Submit ${type} Request`}
        </button>

        {/* Deposit Address Modal */}
        {type === 'DEPOSIT' && depositReady && (
          <div className="mt-6 bg-[var(--card)] p-4 rounded-xl border border-gold text-center">
            <h4 className="text-lg mb-2 gold-text">Send {currency} To:</h4>
            <div className="font-mono break-all bg-gray-900 p-2 rounded mb-2">{depositAddress}</div>
            <button
              className="mb-2 px-4 py-2 rounded gold-gradient-bg text-[#222] font-bold"
              onClick={() => navigator.clipboard.writeText(depositAddress)}
            >
              Copy Address
            </button>
            <button
              className="w-full py-3 rounded-xl gold-gradient-bg text-[#222] font-bold mt-2"
              type="button"
              onClick={() => {
                toast.showToast('We have been notified. Your deposit will be credited after confirmation.', 'success');
                setDepositReady(false);
                setAmount('');
              }}
            >
              Payment Sent
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DepositWithdrawal;
