//Metamask

// import Web3 from 'web3';
// const HDWalletProvider = require('@truffle/hdwallet-provider');

// let web3;

// // Check if we're running in a browser or on the server
// if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
//   // We're in the browser and MetaMask is available
//   web3 = new Web3(window.ethereum);

//   // Request account access if needed
//   window.ethereum.request({ method: 'eth_requestAccounts' }).catch((error) => {
//     console.error('Error connecting to MetaMask:', error);
//   });
// } else {
//   // We're on the server OR the user doesn't have MetaMask
//   // Use our own provider with environment variables for security
//   const provider = new HDWalletProvider(
//     'battle promote scan joy lift spike remove identify erupt pet junior birth',
//     'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a'
//   );
//   web3 = new Web3(provider);
// }

// export default web3;

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
