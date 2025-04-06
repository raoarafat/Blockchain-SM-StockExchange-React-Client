import web3 from './web3';
import StockExchange from './build/StockExchange.json';
import StockExchangeFactory from './build/StockExchangeFactory.json';
require('dotenv').config();

// Check if ABI is a string, if so, parse it
const exchangeAbi =
  typeof StockExchange.abi === 'string'
    ? JSON.parse(StockExchange.abi)
    : StockExchange.abi;

const factoryAbi =
  typeof StockExchangeFactory.abi === 'string'
    ? JSON.parse(StockExchangeFactory.abi)
    : StockExchangeFactory.abi;

// Function to create an instance of a StockExchange contract at a given address
export const getExchangeInstance = (address) => {
  return new web3.eth.Contract(exchangeAbi, address);
};

// Create factory instance with the deployed factory address
const FACTORY_ADDRESS = process.env.deployed_contract_address; // Use the environment variable
export const factory = new web3.eth.Contract(factoryAbi, FACTORY_ADDRESS);

export default getExchangeInstance;
