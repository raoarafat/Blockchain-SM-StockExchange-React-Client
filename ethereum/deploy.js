require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledStockExchange = require('./build/StockExchange.json');

// Create provider with your mnemonic and Infura endpoint
const provider = new HDWalletProvider(
  'battle promote scan joy lift spike remove identify erupt pet junior birth', // Your mnemonic
  'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a' // Your Infura endpoint
);

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account:', accounts[0]);

    // Deploy the StockExchange contract
    const result = await new web3.eth.Contract(compiledStockExchange.abi)
      .deploy({ data: compiledStockExchange.evm.bytecode.object })
      .send({ from: accounts[0], gas: '3000000' });

    console.log('Contract deployed to:', result.options.address);

    // Save the deployed address to a file or environment variable
    // You can use this address in your application
    console.log('Add this address to your .env file or stockexchange.js:');
    console.log(`EXCHANGE_ADDRESS=${result.options.address}`);
  } catch (error) {
    console.error('Deployment failed with error:', error);
  } finally {
    provider.engine.stop();
  }
};

deploy();
