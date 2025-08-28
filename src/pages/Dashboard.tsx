import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { fetchCurrentGoldPrice, fetchGoldPriceHistory } from '../utils/coingecko';
import { useToast } from '../components/Toast';
import PortfolioStats from '../components/PortfolioStats';
import PortfolioChart from '../components/PortfolioChart';
import AdvancedTrading from '../components/AdvancedTrading';
import DepositWithdrawal from '../components/DepositWithdrawal';
import GoldLock from '../components/GoldLock';
import MarketNews from '../components/MarketNews';
import PriceAlerts from '../components/PriceAlerts';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  wallet: {
    balance: number;
    gold_holdings: number;
    address: string;
  };
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [goldPriceHistory, setGoldPriceHistory] = useState<any[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<any[]>([]);
  const [userError, setUserError] = useState('');
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchUserData();
    fetchGoldPrice();
    fetchPortfolioData();
  }, []);

  const fetchUserData = async () => {
    setUserError('');
    setUserLoading(true);
    setLoading(true);
    try {
      const response = await api.get('/user/profile/');
      setUser(response.data);      
      toast.showToast('User profile loaded.', 'success');
    } catch (error: any) {
      setUserError('Failed to load user profile. Please check your login or try again.');
      setUser(null);
      toast.showToast('Failed to load user profile.', 'error');
      console.error('Error fetching user data:', error);
    } finally {
      setUserLoading(false);
      setLoading(false);
    }
  };

  const fetchGoldPrice = async () => {
    const price = await fetchCurrentGoldPrice();
    setGoldPrice(price);
  };

  const handleAdvancedTransaction = async (type: string, data: any) => {
    setLoading(true);
    try {
      await api.post('/user/transactions/', {
        transaction_type: data.transactionType,
        amount: data.amount,
        order_type: data.type,
        limit_price: data.limitPrice,
        stop_price: data.stopPrice
      });
      
      await fetchUserData();
      toast.showToast(`${type} order executed successfully!`, 'success');
    } catch (error: any) {
      toast.showToast(error.response?.data?.error || 'Transaction failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    "pass"
  };

  const fetchPortfolioData = async () => {
    try {
      const history = await fetchGoldPriceHistory();
      setGoldPriceHistory(history);
      
      // Get real portfolio data from backend
      try {
        const portfolioResponse = await api.get('/user/portfolio/');
        const portfolioData = portfolioResponse.data;
        
        // Create portfolio history from backend data
        const realPortfolioHistory = portfolioData.map((snapshot: any) => ({
          date: snapshot.date,
          value: parseFloat(snapshot.total_value)
        }));
        setPortfolioHistory(realPortfolioHistory);
      } catch (portfolioError) {
        // Fallback to mock data if portfolio endpoint not available
        const mockPortfolioHistory = history.map((item: any, index: number) => ({
          date: item.date,
          value: 10000 + (index * 100) + Math.random() * 500
        }));
        setPortfolioHistory(mockPortfolioHistory);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };


  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-8">
        <div className="glassy-card p-8 text-center">
          <div className="text-xl font-semibold mb-4">Loading Dashboard...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] py-8">
        <div className="glassy-card p-8 max-w-md w-full text-center">
          <div className="text-red-400 font-bold text-lg mb-4">{userError}</div>
          <button 
            onClick={fetchUserData} 
            className="px-6 py-3 rounded-xl gold-gradient-bg text-[#222] font-bold shadow-gold hover:scale-105 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || !user.wallet) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-8">
      <div className="glassy-card p-8 text-center">
        <div className="text-xl font-semibold mb-4">No user data available</div>
        <button 
          onClick={fetchUserData} 
          className="px-6 py-3 rounded-xl gold-gradient-bg text-[#222] font-bold shadow-gold hover:scale-105 transition"
        >
          Load User Data
        </button>
      </div>
    </div>
  );
}


  // Calculate portfolio metrics
  const goldValue = user.wallet?.gold_holdings * (goldPrice || 0);
  const totalValue = user.wallet?.balance + goldValue;
  const totalInvested = 10000; // Mock value - in real app, this would be tracked
  const profitLoss = totalValue - totalInvested;
  const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  return (
    <div className="py-8 space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif gold-text2 mb-2">Welcome back, {user.username}!</h1>
        <p className="text-gray-300">Here's your investment overview</p>
      </div>

      {/* Portfolio Stats */}
      <PortfolioStats
        totalValue={totalValue}
        cashBalance={user.wallet.balance}
        goldValue={goldValue}
        totalInvested={totalInvested}
        profitLoss={profitLoss}
        profitLossPercentage={profitLossPercentage}
        goldPrice={goldPrice || 0}
        goldHoldings={user.wallet.gold_holdings}
      />

      {/* Portfolio Chart */}
      <PortfolioChart
        portfolioData={portfolioHistory}
        goldPriceData={goldPriceHistory}
      />

      {/* Trading Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Advanced Trading */}
        <AdvancedTrading
          goldPrice={goldPrice || 0}
          userBalance={user.wallet.balance}
          onTransaction={handleAdvancedTransaction}
        />

        {/* Deposit & Withdrawal */}
        <DepositWithdrawal
          userBalance={user.wallet?.balance || 0}
          onRefresh={handleRefresh}
          user={user} // ✅ pass full user object, not just wallet
        />

      </div>

      {/* Gold Lock & Market News */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Gold Lock */}
        <GoldLock
          goldHoldings={user.wallet.gold_holdings}
          onRefresh={handleRefresh}
        />

        {/* Market News */}
        <MarketNews />
      </div>

      {/* Price Alerts */}
      <PriceAlerts />
    </div>
  );
};

export default Dashboard;