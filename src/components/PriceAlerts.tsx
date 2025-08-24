import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from './Toast';

interface PriceAlert {
  id: number;
  target_price: number;
  alert_type: 'ABOVE' | 'BELOW';
  is_active: boolean;
  created: string;
  triggered?: string;
}

const PriceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [targetPrice, setTargetPrice] = useState('');
  const [alertType, setAlertType] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/user/price-alerts/');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching price alerts:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice) return;

    setLoading(true);
    try {
      await api.post('/user/price-alerts/', {
        target_price: parseFloat(targetPrice),
        alert_type: alertType
      });

      toast.showToast('Price alert created successfully!', 'success');
      setTargetPrice('');
      fetchAlerts();
    } catch (error: any) {
      toast.showToast(error.response?.data?.error || 'Failed to create alert', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    try {
      await api.delete(`/user/price-alerts/${alertId}/`);
      toast.showToast('Alert deleted successfully!', 'success');
      fetchAlerts();
    } catch (error: any) {
      toast.showToast('Failed to delete alert', 'error');
    }
  };

  if (fetching) {
    return (
      <div className="glassy-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gold/20 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gold/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glassy-card p-6">
      <h3 className="text-xl font-serif mb-4 gold-text">Price Alerts</h3>
      
      {/* Create New Alert */}
      <form onSubmit={handleCreateAlert} className="mb-6 p-4 bg-[var(--card)] rounded-xl border border-gold">
        <h4 className="text-lg font-serif mb-3 gold-text">Create New Alert</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-sans mb-2 gold-text">Alert Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAlertType('ABOVE')}
                className={`px-4 py-2 rounded-xl font-sans font-semibold transition-colors ${
                  alertType === 'ABOVE' 
                    ? 'bg-green-600 text-white' 
                    : 'border-2 border-green-600 text-green-600'
                }`}
              >
                Price Above
              </button>
              <button
                type="button"
                onClick={() => setAlertType('BELOW')}
                className={`px-4 py-2 rounded-xl font-sans font-semibold transition-colors ${
                  alertType === 'BELOW' 
                    ? 'bg-red-600 text-white' 
                    : 'border-2 border-red-600 text-red-600'
                }`}
              >
                Price Below
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-sans mb-2 gold-text">Target Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-gold text-[var(--text)] font-sans focus:ring-2 focus:ring-gold"
              placeholder="Enter target price"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !targetPrice}
            className="w-full py-3 rounded-xl font-sans font-bold shadow-gold text-lg gold-gradient-bg hover:scale-105 transition text-[#222] disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      </form>

      {/* Active Alerts */}
      <div>
        <h4 className="text-lg font-serif mb-3 gold-text">Active Alerts</h4>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No active alerts</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-[var(--card)] rounded-xl border border-gold">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      alert.alert_type === 'ABOVE' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {alert.alert_type === 'ABOVE' ? '📈' : '📉'} {alert.alert_type}
                    </span>
                    <span className="text-gold font-bold">${alert.target_price}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Created: {new Date(alert.created).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceAlerts; 