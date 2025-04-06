require('dotenv').config();
import Web3 from 'web3';
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: process.env.mnemonic,
    },
    providerOrUrl: process.env.infura_url,
  });

  web3 = new Web3(provider);
}

export default web3;
