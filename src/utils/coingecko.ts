export const fetchGoldPriceHistory = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=30&interval=daily'
    );
    const data = await response.json();
    return data.prices.map((price: [number, number]) => ({
      date: new Date(price[0]).toISOString().split('T')[0],
      price: price[1],
    }));
  } catch (error) {
    console.error('Error fetching gold price history:', error);
    return [];
  }
};

export const fetchCurrentGoldPrice = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd'
    );
    const data = await response.json();
    return data['pax-gold']?.usd ?? null;
  } catch (error) {
    console.error('Error fetching current gold price:', error);
    return null;
  }
}; 