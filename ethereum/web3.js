import Web3 from 'web3';
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

// if (typeof window !== 'undefined' && typeof window.web3 == 'undefined') {
//   console.log('We are in the browser and metamask is running');
//   // Use the web3 instance injected by the browser
//   // We are in the browser and metamask is running
//   web3 = new Web3(window.web3.currentProvider);
//   console.log('web3: ', web3);
// } else {
//console.log('We are on the server OR the user is not running metamask');
// Fallback to a default provider (optional)
// const provider = new Web3.providers.HttpProvider(
//   'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a' // Replace with your Infura URL
// );
const provider = new HDWalletProvider(
  'battle promote scan joy lift spike remove identify erupt pet junior birth',
  'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a'
);
web3 = new Web3(provider);
// }

export default web3;
