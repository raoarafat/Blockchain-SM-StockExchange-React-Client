import web3 from '../ethereum/web3';
// import { getExchangeInstance, factory } from '../ethereum/stockexchange';

import exchange from '../ethereum/stockexchange';

export const blockchainService = {
  // Test connection to the contract
  async testConnection() {
    try {
      // Simple call to check if the contract exists and is accessible
      const accounts = await web3.eth.getAccounts();
      console.log('Connected account:', accounts[0]);
      console.log('Contract address:', exchange.options.address);
      return { success: true };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
  },

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
  },

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
  },

  // Get user's transaction history
  async getUserTransactions(exchangeAddress) {
    try {
      console.log('Getting transactions, exchange address:', exchangeAddress);

      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts available',
          transactions: [],
        };
      }

      // For now, return mock data to bypass blockchain issues
      const mockTransactions = [
        {
          symbol: 'AAPL',
          price: '150.25',
          quantity: '10',
          timestamp: new Date().toISOString(),
          isBuy: true,
        },
        {
          symbol: 'GOOGL',
          price: '2500.75',
          quantity: '2',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          isBuy: false,
        },
      ];

      console.log('Returning mock transactions for development');
      return { success: true, transactions: mockTransactions };

      /*
      // Uncomment this when ready to test actual blockchain interaction
      const transactions = await exchange.methods.getUserTransactions(accounts[0]).call();
      
      // Format the transactions for UI
      const formattedTransactions = transactions.map(tx => ({
        symbol: tx.symbol,
        price: web3.utils.fromWei(tx.price, 'ether'),
        quantity: tx.quantity,
        timestamp: new Date(parseInt(tx.timestamp) * 1000).toISOString(),
        isBuy: tx.isBuy
      }));
      
      return { success: true, transactions: formattedTransactions };
      */
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return { success: false, error: error.message, transactions: [] };
    }
  },
};
