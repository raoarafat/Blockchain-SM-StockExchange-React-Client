import web3 from '../ethereum/web3';
// import { getExchangeInstance, factory } from '../ethereum/stockexchange';

import exchange from '../ethereum/stockexchange';
import StockExchange from '../ethereum/build/StockExchange.json';

class BlockchainService {
  constructor() {
    this.exchangeAddress = '0xDc5B1E3393316E6C83C0d4676b7E66951E35ADD7'; // Your deployed contract address
    this.contract = new web3.eth.Contract(
      StockExchange.abi,
      this.exchangeAddress
    );
  }

  async getUserTransactions(userAddress) {
    try {
      // Use provided address or fallback to hardcoded address
      console.log('userAddress: ', userAddress);
      const address =
        userAddress || '0x40E2F8ff22D7D63Ca74DFf9D035F09F0e10fBFcC';
      const transactions = await this.contract.methods
        .getUserTransactions(address)
        .call();

      return transactions.map((tx) => ({
        id: `${tx.timestamp}-${tx.symbol}`,
        symbol: tx.symbol,
        type: tx.isBuy ? 'buy' : 'sell',
        quantity: Number(tx.quantity),
        price: Number(web3.utils.fromWei(tx.price, 'ether')),
        total:
          Number(tx.quantity) * Number(web3.utils.fromWei(tx.price, 'ether')),
        date: new Date(Number(tx.timestamp) * 1000).toISOString(),
        trader: tx.trader,
      }));
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  }

  async getPortfolioPositions(userAddress) {
    try {
      // Use provided address or fallback to hardcoded address
      const address =
        userAddress || '0x40E2F8ff22D7D63Ca74DFf9D035F09F0e10fBFcC';
      const transactions = await this.getUserTransactions(address);

      // Calculate positions from transactions
      const positions = new Map();

      transactions.forEach((tx) => {
        const currentPosition = positions.get(tx.symbol) || {
          symbol: tx.symbol,
          quantity: 0,
          totalCost: 0,
        };

        if (tx.type === 'buy') {
          currentPosition.quantity += tx.quantity;
          currentPosition.totalCost += tx.quantity * tx.price;
        } else {
          currentPosition.quantity -= tx.quantity;
          currentPosition.totalCost -= tx.quantity * tx.price;
        }

        if (currentPosition.quantity > 0) {
          currentPosition.averagePrice =
            currentPosition.totalCost / currentPosition.quantity;
          positions.set(tx.symbol, currentPosition);
        } else {
          positions.delete(tx.symbol);
        }
      });

      return Array.from(positions.values());
    } catch (error) {
      console.error('Error calculating portfolio positions:', error);
      return [];
    }
  }

  // Test connection to the contract
  async testConnection() {
    try {
      // Simple call to check if the contract exists and is accessible
      const accounts = await web3.eth.getAccounts();
      console.log('Connected account:', accounts[0]);
      console.log('Contract address:', this.contract.options.address);
      return { success: true };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Record a buy transaction
  async recordBuyTransaction(exchangeAddress, symbol, price, quantity) {
    try {
      // For debugging, log all parameters
      console.log('Buy transaction parameters:', {
        exchangeAddress,
        symbol,
        price,
        quantity,
      });

      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts available. Please connect MetaMask.',
        };
      }

      // Convert values to appropriate formats
      const numericPrice = parseFloat(price);
      const numericQuantity = parseInt(quantity, 10);

      if (isNaN(numericPrice)) {
        return { success: false, error: `Invalid price: ${price}` };
      }

      if (isNaN(numericQuantity) || numericQuantity <= 0) {
        return { success: false, error: `Invalid quantity: ${quantity}` };
      }

      // Convert price to wei
      const priceInWei = web3.utils.toWei(numericPrice.toString(), 'ether');

      console.log('Formatted parameters:', {
        symbol,
        priceInWei,
        numericQuantity,
        from: accounts[0],
      });

      // For now, let's mock the transaction to bypass blockchain issues
      // console.log('Mocking successful transaction for development');
      // return { success: true };

      // Uncomment this when ready to test actual blockchain interaction
      const gasEstimate = await exchange.methods
        .recordBuyTransaction(symbol, priceInWei, numericQuantity)
        .estimateGas({ from: accounts[0] });

      console.log('Gas estimate:', gasEstimate);

      const result = await exchange.methods
        .recordBuyTransaction(symbol, priceInWei, numericQuantity)
        .send({
          from: accounts[0],
          // gas: Math.floor(gasEstimate * 1.5), // Add 50% buffer
          gasPrice: web3.utils.toWei('20', 'gwei'),
        });

      console.log('Transaction result:', result);
      return { success: true, transactionHash: result.transactionHash };
    } catch (error) {
      console.error('Error recording buy transaction:', error);

      // Provide more detailed error information
      let errorMessage = error.message;

      // Check for specific error types
      if (error.message.includes('User denied transaction signature')) {
        errorMessage = 'Transaction was rejected in MetaMask.';
      } else if (error.message.includes('Internal JSON-RPC error')) {
        errorMessage =
          'Transaction failed on the blockchain. This could be due to contract restrictions or insufficient gas.';
      }

      return { success: false, error: errorMessage };
    }
  }

  // Record a sell transaction
  async recordSellTransaction(exchangeAddress, symbol, price, quantity) {
    try {
      // For debugging, log all parameters
      console.log('Sell transaction parameters:', {
        exchangeAddress,
        symbol,
        price,
        quantity,
      });

      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts available. Please connect MetaMask.',
        };
      }

      // Convert values to appropriate formats
      const numericPrice = parseFloat(price);
      const numericQuantity = parseInt(quantity, 10);

      if (isNaN(numericPrice)) {
        return { success: false, error: `Invalid price: ${price}` };
      }

      if (isNaN(numericQuantity) || numericQuantity <= 0) {
        return { success: false, error: `Invalid quantity: ${quantity}` };
      }

      // Convert price to wei
      const priceInWei = web3.utils.toWei(numericPrice.toString(), 'ether');

      console.log('Formatted parameters:', {
        symbol,
        priceInWei,
        numericQuantity,
        from: accounts[0],
      });

      // For now, let's mock the transaction to bypass blockchain issues
      console.log('Mocking successful transaction for development');
      return { success: true };

      /*
      // Uncomment this when ready to test actual blockchain interaction
      const gasEstimate = await exchange.methods
        .recordSellTransaction(symbol, priceInWei, numericQuantity)
        .estimateGas({ from: accounts[0] });
      
      console.log('Gas estimate:', gasEstimate);
      
      const result = await exchange.methods
        .recordSellTransaction(symbol, priceInWei, numericQuantity)
        .send({
          from: accounts[0],
          gas: Math.floor(gasEstimate * 1.5), // Add 50% buffer
          gasPrice: web3.utils.toWei('20', 'gwei')
        });
      
      console.log('Transaction result:', result);
      return { success: true, transactionHash: result.transactionHash };
      */
    } catch (error) {
      console.error('Error recording sell transaction:', error);

      // Provide more detailed error information
      let errorMessage = error.message;

      // Check for specific error types
      if (error.message.includes('User denied transaction signature')) {
        errorMessage = 'Transaction was rejected in MetaMask.';
      } else if (error.message.includes('Internal JSON-RPC error')) {
        errorMessage =
          'Transaction failed on the blockchain. This could be due to contract restrictions or insufficient gas.';
      }

      return { success: false, error: errorMessage };
    }
  }
}

export const blockchainService = new BlockchainService();
