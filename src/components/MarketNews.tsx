import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const MarketNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketNews();
  }, []);

  const fetchMarketNews = async () => {
    try {
      const response = await api.get('/market/news/');
      const backendNews = response.data;
      
      // Transform backend data to match frontend interface
      const transformedNews: NewsItem[] = backendNews.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        source: item.source,
        date: item.published_date,
        sentiment: item.sentiment.toLowerCase() as 'positive' | 'negative' | 'neutral'
      }));
      
      setNews(transformedNews);
    } catch (error) {
      console.error('Error fetching market news:', error);
      // Fallback to mock data if backend not available
      const mockNews: NewsItem[] = [
        {
          id: 1,
          title: "Gold Prices Surge to 3-Month High on Economic Uncertainty",
          summary: "Gold prices climbed to their highest level in three months as investors sought safe-haven assets amid growing economic concerns and inflation fears.",
          source: "Reuters",
          date: "2024-01-15",
          sentiment: "positive"
        },
        {
          id: 2,
          title: "Federal Reserve Signals Potential Rate Cuts in 2024",
          summary: "The Federal Reserve's latest meeting minutes suggest possible interest rate reductions this year, which could further support gold prices.",
          source: "Bloomberg",
          date: "2024-01-14",
          sentiment: "positive"
        },
        {
          id: 3,
          title: "Central Banks Continue Gold Buying Spree",
          summary: "Global central banks purchased 800 tonnes of gold in 2023, marking the second-highest annual total on record.",
          source: "World Gold Council",
          date: "2024-01-13",
          sentiment: "positive"
        },
        {
          id: 4,
          title: "Gold Mining Production Expected to Decline in 2024",
          summary: "Major gold mining companies report declining production forecasts, which could tighten supply and support higher prices.",
          source: "Mining.com",
          date: "2024-01-12",
          sentiment: "positive"
        },
        {
          id: 5,
          title: "Dollar Strength Temporarily Weighs on Gold",
          summary: "A stronger US dollar has put some pressure on gold prices, though the long-term outlook remains bullish.",
          source: "MarketWatch",
          date: "2024-01-11",
          sentiment: "neutral"
        }
      ];
      setNews(mockNews);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <div className="glassy-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gold/20 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gold/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glassy-card p-6">
      <h3 className="text-xl font-serif mb-4 gold-text">Market News & Analysis</h3>
      
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="border-b border-gold/20 pb-4 last:border-b-0">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getSentimentIcon(item.sentiment)}</span>
              <div className="flex-1">
                <h4 className="font-sans font-semibold text-[var(--text)] mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{item.source}</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Sentiment Summary */}
      <div className="mt-6 p-4 bg-[var(--card)] rounded-xl border border-gold">
        <h4 className="text-lg font-serif mb-3 gold-text">Market Sentiment</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl">📈</div>
            <div className="text-sm text-green-400 font-semibold">Bullish</div>
            <div className="text-xs text-gray-400">80%</div>
          </div>
          <div>
            <div className="text-2xl">➡️</div>
            <div className="text-sm text-gray-400 font-semibold">Neutral</div>
            <div className="text-xs text-gray-400">15%</div>
          </div>
          <div>
            <div className="text-2xl">📉</div>
            <div className="text-sm text-red-400 font-semibold">Bearish</div>
            <div className="text-xs text-gray-400">5%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketNews; 