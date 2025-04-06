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

  // Add a stock to an exchange
  async addStock(exchangeAddress, symbol, price, quantity) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const accounts = await web3.eth.getAccounts();

      await exchange.methods.addStock(symbol, price, quantity).send({
        from: accounts[0],
        gas: '1000000',
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding stock:', error);
      return { success: false, error: error.message };
    }
  },

  // Buy stock from an exchange
  async buyStock(exchangeAddress, symbol, quantity) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const accounts = await web3.eth.getAccounts();

      // Get the stock price first
      const stock = await exchange.methods.stocks(symbol).call();
      const totalCost = web3.utils
        .toBN(stock.price)
        .mul(web3.utils.toBN(quantity));

      await exchange.methods.buyStock(symbol, quantity).send({
        from: accounts[0],
        value: totalCost,
        gas: '1000000',
      });

      return { success: true };
    } catch (error) {
      console.error('Error buying stock:', error);
      return { success: false, error: error.message };
    }
  },

  // Sell stock to an exchange
  async sellStock(exchangeAddress, symbol, quantity) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const accounts = await web3.eth.getAccounts();

      await exchange.methods.sellStock(symbol, quantity).send({
        from: accounts[0],
        gas: '1000000',
      });

      return { success: true };
    } catch (error) {
      console.error('Error selling stock:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's portfolio balance for a specific stock
  async getPortfolioBalance(exchangeAddress, symbol) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const accounts = await web3.eth.getAccounts();

      const balance = await exchange.methods
        .getPortfolioBalance(accounts[0], symbol)
        .call();
      return { success: true, balance };
    } catch (error) {
      console.error('Error getting portfolio balance:', error);
      return { success: false, error: error.message, balance: 0 };
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
      return { success: true, transactions };
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return { success: false, error: error.message, transactions: [] };
    }
  },

  // Add this method to your blockchainService
  async getStockInfo(exchangeAddress, symbol) {
    try {
      const exchange = getExchangeInstance(exchangeAddress);
      const stock = await exchange.methods.stocks(symbol).call();
      return {
        success: true,
        stock: {
          symbol: stock.symbol,
          price: stock.price,
          quantity: stock.quantity,
        },
      };
    } catch (error) {
      console.error('Error getting stock info:', error);
      return { success: false, error: error.message };
    }
  },
};
