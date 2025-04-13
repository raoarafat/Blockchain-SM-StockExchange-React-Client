// direct HDWalletProvider
import Web3 from 'web3';
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

const provider = new HDWalletProvider(
  'battle promote scan joy lift spike remove identify erupt pet junior birth',
  'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a'
);
web3 = new Web3(provider);
// }

export default web3;
