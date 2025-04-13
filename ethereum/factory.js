import web3 from './web3';
import StockExchangeFactory from './build/StockExchangeFactory.json';

// Check if StockExchangeFactory.abi is a string, if so, parse it
const abi =
  typeof StockExchangeFactory.abi === 'string'
    ? JSON.parse(StockExchangeFactory.abi)
    : StockExchangeFactory.abi;

const instance = new web3.eth.Contract(
  abi,
  'Your Contract Address' //
);
export default instance;
