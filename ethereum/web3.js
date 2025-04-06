require('dotenv').config();
import Web3 from 'web3';
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

const provider = new HDWalletProvider(
  process.env.mnemonic, // Replace with your mnemonic
  process.env.infura_url // Replace with your Infura URL
);
web3 = new Web3(provider);
// }

export default web3;
