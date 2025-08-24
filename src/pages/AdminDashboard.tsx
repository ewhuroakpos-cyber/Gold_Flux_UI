import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingGoldLocks: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [users, transactions, deposits, withdrawals, goldLocks] = await Promise.all([
        api.get('/admin/users/'),
        api.get('/admin/transactions/'),
        api.get('/admin/deposits/'),
        api.get('/admin/withdrawals/'),
        api.get('/admin/gold-locks/')
      ]);

      setStats({
        totalUsers: users.data.length,
        totalTransactions: transactions.data.length,
        pendingDeposits: deposits.data.filter((d: any) => d.status === 'PENDING').length,
        pendingWithdrawals: withdrawals.data.filter((w: any) => w.status === 'PENDING').length,
        pendingGoldLocks: goldLocks.data.filter((g: any) => g.status === 'PENDING').length,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>Loading...</div>;
  }
  if (!stats) {
    return <div className="text-center min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>Error loading admin data</div>;
  }
  return (
    <div className="space-y-8 min-h-screen py-8 px-2 sm:px-6" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <h1 className="text-4xl font-serif mb-8 gold-text drop-shadow-lg">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="glassy-card p-6">
          <h3 className="text-lg font-serif mb-2 gold-text">Total Users</h3>
          <p className="text-3xl font-bold gold-text">{stats.totalUsers}</p>
        </div>
        <div className="glassy-card p-6">
          <h3 className="text-lg font-serif mb-2 gold-text">Total Transactions</h3>
          <p className="text-3xl font-bold gold-text">{stats.totalTransactions}</p>
        </div>
        <div className="glassy-card p-6">
          <h3 className="text-lg font-serif mb-2 gold-text">Pending Deposits</h3>
          <p className="text-3xl font-bold gold-text">{stats.pendingDeposits}</p>
        </div>
        <div className="glassy-card p-6">
          <h3 className="text-lg font-serif mb-2 gold-text">Pending Withdrawals</h3>
          <p className="text-3xl font-bold gold-text">{stats.pendingWithdrawals}</p>
        </div>
        <div className="glassy-card p-6">
          <h3 className="text-lg font-serif mb-2 gold-text">Pending Gold Locks</h3>
          <p className="text-3xl font-bold gold-text">{stats.pendingGoldLocks}</p>
        </div>
      </div>
      <div className="glassy-card p-8">
        <h2 className="text-2xl font-serif mb-6 gold-text">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/admin/deposits" className="block p-6 rounded-xl border-2 border-gold text-gold hover:bg-gold hover:text-[#222] transition-colors text-center font-sans">
            <h3 className="text-lg font-serif mb-2">Manage Deposits</h3>
            <p className="text-sm">Review and approve deposit requests</p>
          </a>
          <a href="/admin/withdrawals" className="block p-6 rounded-xl border-2 border-gold text-gold hover:bg-gold hover:text-[#222] transition-colors text-center font-sans">
            <h3 className="text-lg font-serif mb-2">Manage Withdrawals</h3>
            <p className="text-sm">Review and approve withdrawal requests</p>
          </a>
          <a href="/admin/gold-locks" className="block p-6 rounded-xl border-2 border-gold text-gold hover:bg-gold hover:text-[#222] transition-colors text-center font-sans">
            <h3 className="text-lg font-serif mb-2">Manage Gold Locks</h3>
            <p className="text-sm">Review and approve gold lock requests</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 