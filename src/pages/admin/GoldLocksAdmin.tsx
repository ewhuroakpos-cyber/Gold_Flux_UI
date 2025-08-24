import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface GoldLock {
  id: number;
  user: string;
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

const GoldLocksAdmin: React.FC = () => {
  const [goldLocks, setGoldLocks] = useState<GoldLock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoldLocks();
  }, []);

  const fetchGoldLocks = async () => {
    try {
      const response = await api.get('/admin/gold-locks/');
      setGoldLocks(response.data);
    } catch (error) {
      console.error('Error fetching gold locks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (lockId: number, action: 'approve' | 'reject') => {
    try {
      await api.patch(`/admin/gold-locks/${lockId}/approve/`, { action });
      await fetchGoldLocks();
    } catch (error) {
      console.error('Error updating gold lock:', error);
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen gold-gradient-bg text-gold text-2xl font-serif">Loading...</div>;
  }
  return (
    <div className="space-y-6 gold-gradient-bg min-h-screen py-8 px-2 sm:px-6" style={{ fontFamily: 'var(--font-sans)' }}>
      <h1 className="text-4xl font-serif mb-8 gold-text drop-shadow-lg">Manage Gold Locks</h1>
      <div className="glassy-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold">
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">User</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Amount (oz)</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Interest Rate</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Period</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Status</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Date</th>
                <th className="px-6 py-4 text-left font-sans font-semibold gold-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {goldLocks.map((lock) => (
                <tr key={lock.id} className="border-b border-gold hover:bg-gold/10">
                  <td className="px-6 py-4 font-sans gold-text">{lock.user}</td>
                  <td className="px-6 py-4 font-sans gold-text">{lock.amount.toFixed(4)}</td>
                  <td className="px-6 py-4 font-sans">{lock.interest_rate}%</td>
                  <td className="px-6 py-4 font-sans">{Math.ceil((new Date(lock.end_date).getTime() - new Date(lock.start_date).getTime()) / (1000 * 60 * 60 * 24))} days</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-sans font-semibold ${getStatusColor(lock.status)}`}>{lock.status}</span></td>
                  <td className="px-6 py-4 font-sans">{new Date(lock.created).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{lock.status === 'PENDING' && (<div className="flex gap-2"><button onClick={() => handleAction(lock.id, 'approve')} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-sans hover:bg-green-700">Approve</button><button onClick={() => handleAction(lock.id, 'reject')} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-sans hover:bg-red-700">Reject</button></div>)}{lock.status !== 'PENDING' && (<span className="text-sm text-gray-400 font-sans">{lock.approved_by && `by ${lock.approved_by}`}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {goldLocks.length === 0 && (
          <div className="text-center py-12 text-gray-400"><p className="text-lg font-sans">No gold lock requests found</p></div>
        )}
      </div>
    </div>
  );
};
export default GoldLocksAdmin; 