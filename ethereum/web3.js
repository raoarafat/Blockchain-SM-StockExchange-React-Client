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
      phrase:
        'battle promote scan joy lift spike remove identify erupt pet junior birth',
    },
    providerOrUrl:
      'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a', // process.env.infura_url,
  });

  // const provider = new HDWalletProvider(
  //   'battle promote scan joy lift spike remove identify erupt pet junior birth',
  //   'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a'
  // );

  web3 = new Web3(provider);
}

export default web3;
