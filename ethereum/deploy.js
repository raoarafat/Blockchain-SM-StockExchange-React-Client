const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3'); // Use destructuring to access the Web3 class
const compiledFactory = require('./build/CampaignFactory.json');

// Set up provider with your mnemonic and Infura URL
provider = new HDWalletProvider(
  'battle promote scan joy lift spike remove identify erupt pet junior birth',
  'https://sepolia.infura.io/v3/09e89fac4db649a397524b4d6f80434a'
);

const web3 = new Web3(provider); // This should now work correctly with version 4.x

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const balance = await web3.eth.getBalance(accounts[0]);
    console.log('Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');

    console.log('Current gas price (in wei):', await web3.eth.getGasPrice());

    // Ensure bytecode is correct
    const bytecode = compiledFactory.evm.bytecode.object; // Or just compiledFactory.bytecode
    console.log('Contract bytecode:', bytecode);

    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({
        data: bytecode, // Use correct bytecode here
      })
      .send({
        gas: '5000000', // Keep gas limit reasonable
        gasPrice: web3.utils.toWei('2', 'gwei'), // Reduce gas price
        from: accounts[0],
      });

    console.log('Contract deployed to:', result.options.address);
  } catch (error) {
    console.error('Deployment failed with error:', error);
  } finally {
    provider.engine.stop();
  }
};

deploy();
