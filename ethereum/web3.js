// direct HDWalletProvider
import Web3 from 'web3';
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

const provider = new HDWalletProvider(
  '', // Your mnemonic
  '' // Your Infura endpoint
);
web3 = new Web3(provider);
// }

export default web3;
