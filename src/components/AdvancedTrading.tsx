import React, { useState } from 'react';
import { useToast } from './Toast';

interface AdvancedTradingProps {
  goldPrice: number;
  userBalance: number;
  onTransaction: (type: 'MARKET' | 'LIMIT' | 'STOP', data: any) => void;
}

const AdvancedTrading: React.FC<AdvancedTradingProps> = ({
  goldPrice,
  onTransaction
}) => {
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP'>('MARKET');
  const [transactionType, setTransactionType] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      const orderData = {
        type: orderType,
        transactionType,
        amount: parseFloat(amount),
        price: orderType === 'MARKET' ? goldPrice : parseFloat(limitPrice || stopPrice),
        limitPrice: orderType === 'LIMIT' ? parseFloat(limitPrice) : undefined,
        stopPrice: orderType === 'STOP' ? parseFloat(stopPrice) : undefined
      };

      await onTransaction(orderType, orderData);
      toast.showToast(`${orderType} ${transactionType} order placed successfully!`, 'success');
      
      // Reset form
      setAmount('');
      setLimitPrice('');
      setStopPrice('');
    } catch (error: any) {
      toast.showToast(error.message || 'Order failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!amount) return 0;
    const price = orderType === 'MARKET' ? goldPrice : parseFloat(limitPrice || stopPrice) || goldPrice;
    return parseFloat(amount) * price;
  };

  return (
    <div className="glassy-card p-8">
      <h2 className="text-2xl font-serif mb-6 gold-text">Advanced Trading</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Type Selection */}
        <div>
          <label className="block text-sm font-sans mb-3 gold-text">Order Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setOrderType('MARKET')}
              className={`px-4 py-2 rounded-xl font-sans font-semibold transition-colors ${
                orderType === 'MARKET' 
                  ? 'gold-gradient-bg text-[#222]' 
                  : 'border-2 border-gold text-gold'
              }`}
            >
              Market Order
            </button>
            <button
              type="button"
              onClick={() => setOrderType('LIMIT')}
              className={`px-4 py-2 rounded-xl font-sans font-semibold transition-colors ${
                orderType === 'LIMIT' 
                  ? 'gold-gradient-bg text-[#222]' 
                  : 'border-2 border-gold text-gold'
              }`}
            >
              Limit Order
            </button>
            <button
              type="button"
              onClick={() => setOrderType('STOP')}
              className={`px-4 py-2 rounded-xl font-sans font-semibold transition-colors ${
                orderType === 'STOP' 
                  ? 'gold-gradient-bg text-[#222]' 
                  : 'border-2 border-gold text-gold'
              }`}
            >
              Stop Loss
            </button>
          </div>
        </div>

        {/* Buy/Sell Selection */}
        <div>
          <label className="block text-sm font-sans mb-3 gold-text">Action</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTransactionType('BUY')}
              className={`px-6 py-3 rounded-xl font-sans font-semibold transition-colors ${
                transactionType === 'BUY' 
                  ? 'bg-green-600 text-white' 
                  : 'border-2 border-green-600 text-green-600'
              }`}
            >
              Buy Gold
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('SELL')}
              className={`px-6 py-3 rounded-xl font-sans font-semibold transition-colors ${
                transactionType === 'SELL' 
                  ? 'bg-red-600 text-white' 
                  : 'border-2 border-red-600 text-red-600'
              }`}
            >
              Sell Gold
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-sans mb-2 gold-text">Amount (oz)</label>
          <input
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Price Inputs based on Order Type */}
        {orderType === 'LIMIT' && (
          <div>
            <label className="block text-sm font-sans mb-2 gold-text">Limit Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
              placeholder="Enter limit price"
              required
            />
          </div>
        )}

        {orderType === 'STOP' && (
          <div>
            <label className="block text-sm font-sans mb-2 gold-text">Stop Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
              placeholder="Enter stop price"
              required
            />
          </div>
        )}

        {/* Order Summary */}
        {amount && (
          <div className="bg-[var(--card)] p-4 rounded-xl border border-gold">
            <h4 className="text-lg font-serif mb-2 gold-text">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Type:</span>
                <span className="gold-text">{orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Action:</span>
                <span className={transactionType === 'BUY' ? 'text-green-400' : 'text-red-400'}>
                  {transactionType}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="gold-text">{amount} oz</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="gold-text">
                  ${(orderType === 'MARKET' ? goldPrice : parseFloat(limitPrice || stopPrice) || goldPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="gold-text">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount || (orderType !== 'MARKET' && !limitPrice && !stopPrice)}
          className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222] disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Place ${orderType} Order`}
        </button>
      </form>
    </div>
  );
};

export default AdvancedTrading; 