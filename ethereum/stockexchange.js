// import web3 from './web3';
// import StockExchange from './build/StockExchange.json';
// import StockExchangeFactory from './build/StockExchangeFactory.json';
// require('dotenv').config();

// // Check if ABI is a string, if so, parse it
// const exchangeAbi =
//   typeof StockExchange.abi === 'string'
//     ? JSON.parse(StockExchange.abi)
//     : StockExchange.abi;

// const factoryAbi =
//   typeof StockExchangeFactory.abi === 'string'
//     ? JSON.parse(StockExchangeFactory.abi)
//     : StockExchangeFactory.abi;

// // Function to create an instance of a StockExchange contract at a given address
// export const getExchangeInstance = (address) => {
//   return new web3.eth.Contract(exchangeAbi, address);
// };

// // Create factory instance with the deployed factory address
// const FACTORY_ADDRESS = '0x39F0aa60b0cc89B404bc7e90DAb8AcE97Ee76020'; //process.env.deployed_contract_address; // Use the environment variable
// console.log('FACTORY_ADDRESS: ', FACTORY_ADDRESS);
// export const factory = new web3.eth.Contract(factoryAbi, FACTORY_ADDRESS);

// export default getExchangeInstance;

import web3 from './web3';
import StockExchange from './build/StockExchange.json';

// Check if ABI is a string, if so, parse it
const exchangeAbi =
  typeof StockExchange.abi === 'string'
    ? JSON.parse(StockExchange.abi)
    : StockExchange.abi;

// Create an instance of the contract with the deployed address
const EXCHANGE_ADDRESS = '0xDc5B1E3393316E6C83C0d4676b7E66951E35ADD7';
const exchange = new web3.eth.Contract(exchangeAbi, EXCHANGE_ADDRESS);

export default exchange;
