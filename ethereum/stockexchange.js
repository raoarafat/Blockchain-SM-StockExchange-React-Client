import web3 from './web3';
import StockExchange from './build/StockExchange.json';

// Check if StockExchange.abi is a string, if so, parse it
const abi =
  typeof StockExchange.abi === 'string'
    ? JSON.parse(StockExchange.abi)
    : StockExchange.abi;

// Function to create an instance of a StockExchange contract at a given address
const getCampaignInstance = (address) => {
  return new web3.eth.Contract(abi, address);
};

export default getCampaignInstance;
