# Blockchain-Based Stock Exchange Platform

A decentralized stock exchange platform built with Next.js, React, and Ethereum smart contracts. This platform allows users to buy and sell stocks with transactions recorded on the blockchain.

## Features

- **User Authentication**: Secure login system with MetaMask wallet integration
- **Real-time Market Data**: View live stock prices and market information
- **Portfolio Management**: Track your investments and transaction history
- **Blockchain Integration**: All transactions are recorded on the Ethereum blockchain
- **Responsive Design**: Built with Semantic UI React for a modern, mobile-friendly interface

## Technology Stack

- **Frontend**:

  - Next.js
  - React
  - Semantic UI React
  - Web3.js

- **Smart Contracts**:

  - Solidity
  - Ethereum
  - Truffle/Hardhat

- **Other Tools**:
  - MetaMask
  - Node.js
  - Ethers.js

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Ethereum testnet (Sepolia) account with test ETH

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Blockchain-SM-StockExchange-React-Client.git
cd Blockchain-SM-StockExchange-React-Client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_NETWORK_ID=11155111  # Sepolia testnet
```

4. Run the development server:

```bash
npm run dev
```

## Project Structure

```plaintext
stock-exchange/
├── ethereum/
│   ├── contracts/
│   │   └── StockExchange.sol    # Main smart contract
│   ├── compile.js               # Script to compile contracts
│   ├── deploy.js                # Script to deploy contracts
│   ├── factory.js               # Contract instance configuration
│   └── web3.js                  # Web3 configuration
├── components/
│   ├── Header.js                # Navigation header
│   ├── BuyStockModal.js         # Stock purchase modal
│   ├── SellStockModal.js        # Stock selling modal
│   └── ProtectedRoute.js        # Auth route wrapper
├── context/
│   ├── AuthContext.js           # Authentication context
│   └── PortfolioContext.js      # Portfolio management context
├── pages/
│   ├── index.js                 # Market view page
│   ├── portfolio.js             # Portfolio page
│   └── login.js                 # Login page
├── services/
│   └── blockchainService.js     # Blockchain interaction service
├── utils/
│   └── formatters.js            # Utility functions
└── styles/
    └── global.js                # Global styles
```

## Key Files and Directories

### `ethereum/contracts/StockExchange.sol`

- Smart contract for managing stock transactions
- Contains functionality for buying/selling stocks and tracking transactions

### `ethereum/deploy.js`

- Script to deploy `StockExchange` contract to the Ethereum network

### `pages/index.js`

- Displays the market view with available stocks
- Implements buy/sell functionality

### `pages/portfolio.js`

- Shows user's portfolio and transaction history
- Displays investment statistics and performance

## Smart Contract Functions

### StockExchange Contract

- `recordBuyTransaction(string symbol, uint256 price, uint256 quantity)`: Records a stock purchase
- `recordSellTransaction(string symbol, uint256 price, uint256 quantity)`: Records a stock sale
- `getUserTransactions(address user)`: Returns user's transaction history
- `testConnection()`: Verifies contract connectivity

## Deployment

To deploy the application:

1. **Deploy Contract**:

   ```bash
   node ethereum/deploy.js
   ```

2. **Update Contract Address**:
   Update the deployed address in `.env` and `factory.js`

3. **Build and Start**:
   ```bash
   npm run build
   npm start
   ```

## Testing

Run tests with:

```bash
npm test
```

Tests cover smart contract functionality and React components.

## Security Considerations

- All transactions require MetaMask authentication
- Smart contract includes security measures for transaction validation
- Protected routes ensure authenticated access
- Input validation for all transactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Notes

- Ensure MetaMask is connected to the Sepolia testnet
- Keep your MetaMask wallet funded with test ETH
- Check the console for transaction status and errors
- All transactions are recorded on the blockchain and may take time to process
