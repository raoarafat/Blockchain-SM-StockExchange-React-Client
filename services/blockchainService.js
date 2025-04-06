import web3 from '../ethereum/web3';
import { getExchangeInstance, factory } from '../ethereum/stockexchange';

export const blockchainService = {
  // Get all deployed exchanges
  async getDeployedExchanges() {
    try {
      // Check if factory has an address
      if (!factory.options.address) {
        console.error('Factory contract address not specified');
        return {
          success: false,
          error: 'Factory contract address not specified',
          exchanges: [],
        };
      }

      const exchanges = await factory.methods.getDeployedExchanges().call();
      return { success: true, exchanges };
    } catch (error) {
      console.error('Error getting deployed exchanges:', error);
      return { success: false, error: error.message, exchanges: [] };
    }
  },

  // Create a new exchange
  async createExchange() {
    try {
      // Check if factory has an address
      if (!factory.options.address) {
        console.error('Factory contract address not specified');
        return {
          success: false,
          error: 'Factory contract address not specified',
        };
      }

      const accounts = await web3.eth.getAccounts();
      await factory.methods.createExchange().send({
        from: accounts[0],
        gas: '3000000',
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating exchange:', error);
      return { success: false, error: error.message };
    }
  },

  // Record a buy transaction
  async recordBuyTransaction(exchangeAddress, symbol, price, quantity) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const accounts = await web3.eth.getAccounts();

      // Convert price to wei for blockchain storage
      const priceInWei = web3.utils.toWei(price.toString(), 'ether');

      await exchange.methods
        .recordBuyTransaction(symbol, priceInWei, quantity)
        .send({
          from: accounts[0],
          gas: '1000000',
        });

      return { success: true };
    } catch (error) {
      console.error('Error recording buy transaction:', error);
      return { success: false, error: error.message };
    }
  },

  // Record a sell transaction
  async recordSellTransaction(exchangeAddress, symbol, price, quantity) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const accounts = await web3.eth.getAccounts();

      // Convert price to wei for blockchain storage
      const priceInWei = web3.utils.toWei(price.toString(), 'ether');

      await exchange.methods
        .recordSellTransaction(symbol, priceInWei, quantity)
        .send({
          from: accounts[0],
          gas: '1000000',
        });

      return { success: true };
    } catch (error) {
      console.error('Error recording sell transaction:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's transaction history
  async getUserTransactions(exchangeAddress) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const accounts = await web3.eth.getAccounts();

      const transactions = await exchange.methods
        .getUserTransactions(accounts[0])
        .call();

      // Format the transactions for UI
      const formattedTransactions = transactions.map((tx) => ({
        symbol: tx.symbol,
        price: web3.utils.fromWei(tx.price, 'ether'),
        quantity: tx.quantity,
        timestamp: new Date(tx.timestamp * 1000).toISOString(),
        isBuy: tx.isBuy,
      }));

      return { success: true, transactions: formattedTransactions };
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return { success: false, error: error.message, transactions: [] };
    }
  },
};
