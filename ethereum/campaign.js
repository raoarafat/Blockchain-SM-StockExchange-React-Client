// import web3 from './web3';
// import Campaign from './build/Campaign.json';

// export default async (address) => {
//   return await new web3.eth.Contract(Campaign.abi, address);
// };

import web3 from './web3';
import Campaign from './build/Campaign.json';

// Check if Campaign.abi is a string, if so, parse it
const abi =
  typeof Campaign.abi === 'string' ? JSON.parse(Campaign.abi) : Campaign.abi;

// Function to create an instance of a Campaign contract at a given address
const getCampaignInstance = (address) => {
  return new web3.eth.Contract(abi, address);
};

export default getCampaignInstance;
