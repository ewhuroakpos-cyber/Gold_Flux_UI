import React from 'react';

interface PortfolioStatsProps {
  totalValue: number;
  cashBalance: number;
  goldValue: number;
  totalInvested: number;
  profitLoss: number;
  profitLossPercentage: number;
  goldPrice: number;
  goldHoldings: number;
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  totalValue,
  cashBalance,
  goldValue,
  profitLoss,
  profitLossPercentage,
  goldPrice,
  goldHoldings
}) => {
  const isProfit = profitLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <div className="glassy-card p-6">
        <h3 className="text-lg font-serif mb-2 gold-text">Total Portfolio</h3>
        <p className="text-3xl font-bold gold-text">${totalValue.toLocaleString()}</p>
        <div className={`text-sm mt-2 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
          {isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}% ({isProfit ? '+' : ''}${profitLoss.toFixed(2)})
        </div>
      </div>

      {/* Cash Balance */}
      <div className="glassy-card p-6">
        <h3 className="text-lg font-serif mb-2 gold-text">Cash Balance</h3>
        <p className="text-3xl font-bold gold-text">${cashBalance.toLocaleString()}</p>
        <div className="text-sm mt-2 text-gray-400">
          Available for trading
        </div>
      </div>

      {/* Gold Holdings */}
      <div className="glassy-card p-6">
        <h3 className="text-lg font-serif mb-2 gold-text">Gold Holdings</h3>
        <p className="text-3xl font-bold gold-text">{Number(goldHoldings)?.toFixed(4) || '0.0000'} oz</p>
        <div className="text-sm mt-2 gold-text">
          Worth ${goldValue.toLocaleString()}
        </div>
      </div>

      {/* Current Gold Price */}
      <div className="glassy-card p-6">
        <h3 className="text-lg font-serif mb-2 gold-text">Gold Price</h3>
        <p className="text-3xl font-bold gold-text">${goldPrice?.toFixed(2) || 'Loading...'}</p>
        <div className="text-sm mt-2 text-gray-400">
          Per troy ounce
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats; 