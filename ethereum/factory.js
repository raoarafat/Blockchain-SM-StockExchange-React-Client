import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// Check if CampaignFactory.abi is a string, if so, parse it
const abi =
  typeof CampaignFactory.abi === 'string'
    ? JSON.parse(CampaignFactory.abi)
    : CampaignFactory.abi;

const instance = new web3.eth.Contract(
  abi,
  process.env.deployed_contract_address // Replace with the deployed contract address
);

//1 - 0x49F16b275e4941624f2CCeF09097765f3B0dcA84 // with data
//2 - 0x61B6E0f79F54c6606f54b1386E499E2b2e215bcc // with data
//3 - 0x70C44d7d18E95CE12aD6468313544805D130dd7d // with campaign name but name not coming
//4 - 0x19D45352549664fdD92878291CfC1909239b3565 // with campaign name

export default instance;
