import { blockchainService } from '../services/blockchainService';
import companiesData from '../data/companies.json';

export const initializeStocks = async (exchangeAddress) => {
  console.log('Initializing stocks in exchange:', exchangeAddress);

  for (const company of companiesData) {
    try {
      // Convert price to wei (assuming prices are in ether in your UI)
      const priceInWei = web3.utils.toWei(company.buyPrice.toString(), 'ether');

      // Add each stock to the exchange
      await blockchainService.addStock(
        exchangeAddress,
        company.symbol,
        priceInWei,
        1000 // Initial quantity
      );

      console.log(`Added stock ${company.symbol} to exchange`);
    } catch (error) {
      console.error(`Error adding stock ${company.symbol}:`, error);
    }
  }

  console.log('Stock initialization complete');
};
