import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Transaction {
  id: number;
  transaction_type: 'BUY' | 'SELL';
  amount: number;
  price_at_transaction: number;
  timestamp: string;
  user: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/user/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>Loading...</div>;
  }

  return (
    <div className="space-y-6 min-h-screen py-8 px-2 sm:px-6" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <h1 className="text-4xl font-serif mb-8 gold-text drop-shadow-lg">My Transactions</h1>
      <div className="glassy-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold">
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Type</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Amount (oz)</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Price</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Total</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gold hover:bg-gold/10">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-sans font-semibold ${transaction.transaction_type === 'BUY' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{transaction.transaction_type}</span>
                  </td>
                  <td className="px-6 py-4 font-sans gold-text">{transaction.amount.toFixed(4)}</td>
                  <td className="px-6 py-4 font-sans">${transaction.price_at_transaction.toFixed(2)}</td>
                  <td className="px-6 py-4 font-sans">${(transaction.amount * transaction.price_at_transaction).toFixed(2)}</td>
                  <td className="px-6 py-4 font-sans">{new Date(transaction.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-sans">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions; 