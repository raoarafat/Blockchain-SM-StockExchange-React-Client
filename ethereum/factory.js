import web3 from './web3';
import StockExchangeFactory from './build/StockExchangeFactory.json';

// Check if StockExchangeFactory.abi is a string, if so, parse it
const abi =
  typeof StockExchangeFactory.abi === 'string'
    ? JSON.parse(StockExchangeFactory.abi)
    : StockExchangeFactory.abi;

const instance = new web3.eth.Contract(
  abi,
  '0xc9fDd40f73F4f74ff95756F08F50f81c55764084'
);
export default instance;
