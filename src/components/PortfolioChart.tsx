import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PortfolioChartProps {
  portfolioData: {
    date: string;
    value: number;
  }[];
  goldPriceData: {
    date: string;
    price: number;
  }[];
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ portfolioData, goldPriceData }) => {
  // Combine data for the chart
  const chartData = portfolioData.map((item, index) => ({
    date: item.date,
    portfolioValue: item.value,
    goldPrice: goldPriceData[index]?.price || 0
  }));

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="glassy-card p-6">
      <h3 className="text-xl font-serif mb-4 gold-text">Portfolio Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 215, 0, 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#FFD700"
              fontSize={12}
              tick={{ fill: '#FFD700' }}
            />
            <YAxis 
              stroke="#FFD700"
              fontSize={12}
              tick={{ fill: '#FFD700' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                border: '1px solid #FFD700',
                borderRadius: '8px',
                color: '#FFD700'
              }}
              formatter={(value: number, name: string) => [
                name === 'portfolioValue' ? formatCurrency(value) : `$${value.toFixed(2)}`,
                name === 'portfolioValue' ? 'Portfolio Value' : 'Gold Price'
              ]}
              labelStyle={{ color: '#FFD700' }}
            />
            <Legend 
              wrapperStyle={{ color: '#FFD700' }}
              formatter={(value) => <span style={{ color: '#FFD700' }}>{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="portfolioValue" 
              stroke="#FFD700" 
              strokeWidth={3}
              dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#B8860B', strokeWidth: 2 }}
              name="Portfolio Value"
            />
            <Line 
              type="monotone" 
              dataKey="goldPrice" 
              stroke="#B8860B" 
              strokeWidth={2}
              dot={{ fill: '#B8860B', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#FFD700', strokeWidth: 2 }}
              name="Gold Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioChart; 