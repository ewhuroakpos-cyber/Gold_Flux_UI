import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface DepositRequest {
  id: number;
  user: string;
  amount: number;
  currency: 'BTC' | 'USDT' | 'ETH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created: string;
  approved_at?: string;
  approved_by?: string;
}

const DepositsAdmin: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const response = await api.get('/admin/deposits/');
      setDeposits(response.data);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (depositId: number, action: 'approve' | 'reject') => {
    try {
      await api.patch(`/admin/deposits/${depositId}/approve/`, { action });
      await fetchDeposits();
    } catch (error) {
      console.error('Error updating deposit:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-600';
      case 'REJECTED': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen gold-gradient-bg text-gold text-2xl font-serif">Loading...</div>;
  }
  return (
    <div className="space-y-6 gold-gradient-bg min-h-screen py-8 px-2 sm:px-6" style={{ fontFamily: 'var(--font-sans)' }}>
      <h1 className="text-4xl font-serif mb-8 gold-text drop-shadow-lg">Manage Deposits</h1>
      <div className="glassy-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold">
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">User</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Amount</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Currency</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Status</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Date</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b border-gold hover:bg-gold/10">
                  <td className="px-6 py-4 font-sans gold-text">{deposit.user}</td>
                  <td className="px-6 py-4 font-sans gold-text">{deposit.amount}</td>
                  <td className="px-6 py-4 font-sans">{deposit.currency}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-sans font-semibold ${getStatusColor(deposit.status)}`}>{deposit.status}</span></td>
                  <td className="px-6 py-4 font-sans">{new Date(deposit.created).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{deposit.status === 'PENDING' && (<div className="flex gap-2"><button onClick={() => handleAction(deposit.id, 'approve')} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-sans hover:bg-green-700">Approve</button><button onClick={() => handleAction(deposit.id, 'reject')} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-sans hover:bg-red-700">Reject</button></div>)}{deposit.status !== 'PENDING' && (<span className="text-sm text-gray-400 font-sans">{deposit.approved_by && `by ${deposit.approved_by}`}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deposits.length === 0 && (
          <div className="text-center py-12 text-gray-400"><p className="text-lg font-sans">No deposit requests found</p></div>
        )}
      </div>
    </div>
  );
};
export default DepositsAdmin; 