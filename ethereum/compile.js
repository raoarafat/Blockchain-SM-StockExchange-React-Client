const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Path to build folder
const buildPath = path.resolve(__dirname, 'build');
// Remove build folder if it exists
fs.removeSync(buildPath);

// Path to contract
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
// Read contract
const source = fs.readFileSync(campaignPath, 'utf8');

// Prepare input for the compiler
const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

// Compile contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Log the output to inspect its structure
console.log(JSON.stringify(output, null, 2));

// Ensure the build directory exists
fs.ensureDirSync(buildPath);

// Check if output contains the compiled contracts
if (output.contracts && output.contracts['Campaign.sol']) {
  // Write output to build folder
  for (let contract in output.contracts['Campaign.sol']) {
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(':', '') + '.json'),
      output.contracts['Campaign.sol'][contract]
    );
  }
  console.log('Contracts compiled and written to build folder');
} else {
  console.log('Error: Contracts not found in the output');
}
