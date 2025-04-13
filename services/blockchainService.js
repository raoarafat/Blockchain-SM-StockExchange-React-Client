import web3 from '../ethereum/web3';
// import { getExchangeInstance, factory } from '../ethereum/stockexchange';

import exchange from '../ethereum/stockexchange';
import StockExchange from '../ethereum/build/StockExchange.json';

class BlockchainService {
  constructor() {
    this.exchangeAddress = '0xDc5B1E3393316E6C83C0d4676b7E66951E35ADD7';
    try {
      this.contract = new web3.eth.Contract(
        StockExchange.abi,
        this.exchangeAddress
      );
      this.web3 = web3;
    } catch (error) {
      console.error('Error initializing BlockchainService:', error);
    }
  }

  async getUserTransactions(userAddress) {
    try {
      const transactions = await this.contract.methods
        .getUserTransactions(userAddress)
        .call();

      console.log('Raw blockchain transactions:', transactions); // Debug log

      return transactions.map((tx) => ({
        symbol: tx.symbol,
        price: tx.price,
        quantity: tx.quantity,
        timestamp: tx.timestamp,
        isBuy: tx.isBuy,
      }));
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  }

  async getPortfolioPositions(userAddress) {
    try {
      if (!userAddress) {
        throw new Error('User address is required');
      }

      const transactions = await this.getUserTransactions(userAddress);
      console.log('Fetched transactions for address:', userAddress);
      console.log('Processing transactions:', transactions);

      const positions = {};

      transactions.forEach((tx) => {
        const symbol = tx.symbol;
        if (!positions[symbol]) {
          positions[symbol] = {
            symbol,
            quantity: 0,
            totalCost: 0,
            averagePrice: 0,
          };
        }

        const price = parseFloat(this.web3.utils.fromWei(tx.price, 'ether'));
        const quantity = parseInt(tx.quantity);

        console.log(`Processing transaction for ${symbol}:`, {
          isBuy: tx.isBuy,
          quantity,
          price,
          currentQuantity: positions[symbol].quantity,
        });

        if (tx.isBuy) {
          positions[symbol].quantity += quantity;
          positions[symbol].totalCost += price * quantity;
        } else {
          positions[symbol].quantity -= quantity;
          positions[symbol].totalCost = Math.max(
            0,
            positions[symbol].totalCost - price * quantity
          );
        }

        if (positions[symbol].quantity > 0) {
          positions[symbol].averagePrice =
            positions[symbol].totalCost / positions[symbol].quantity;
        }
      });

      const result = Object.values(positions).filter((p) => p.quantity > 0);
      console.log('Final positions:', result);
      return result;
    } catch (error) {
      console.error('Error calculating portfolio positions:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No Ethereum accounts available');
      }
      console.log('Connected account:', accounts[0]);
      console.log('Contract address:', this.contract.options.address);

      // Test if contract is responding
      const isConnected = await this.contract.methods.testConnection().call();
      if (!isConnected) {
        throw new Error('Contract test connection failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  // Record a buy transaction
  async recordBuyTransaction(symbol, price, quantity) {
    try {
      const accounts = await web3.eth.getAccounts();
      // Convert price to string and handle decimal places
      const priceString = typeof price === 'number' ? price.toString() : '0';
      const priceInWei = this.web3.utils.toWei(priceString, 'ether');

      console.log('Recording buy transaction:', {
        symbol,
        price,
        priceString,
        priceInWei,
        quantity,
      });

      const result = await this.contract.methods
        .recordBuyTransaction(symbol, priceInWei, quantity)
        .send({
          from: accounts[0],
          gas: '3000000',
        });

      return { success: true, transaction: result };
    } catch (error) {
      console.error('Error recording buy transaction:', error);
      return { success: false, error: error.message };
    }
  }

  // Record a sell transaction
  async recordSellTransaction(symbol, price, quantity) {
    try {
      const accounts = await web3.eth.getAccounts();
      // Convert price to string and handle decimal places
      const priceString = typeof price === 'number' ? price.toString() : '0';
      const priceInWei = this.web3.utils.toWei(priceString, 'ether');

      console.log('Recording sell transaction:', {
        symbol,
        price,
        priceString,
        priceInWei,
        quantity,
      });

      const result = await this.contract.methods
        .recordSellTransaction(symbol, priceInWei, quantity)
        .send({
          from: accounts[0],
          gas: '3000000',
        });

      return { success: true, transaction: result };
    } catch (error) {
      console.error('Error recording sell transaction:', error);
      return { success: false, error: error.message };
    }
  }
}

export const blockchainService = new BlockchainService();
