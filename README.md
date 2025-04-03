# Crowdfunding Platform

This application is a decentralized crowdfunding platform powered by Ethereum and Solidity. It enables users to create campaigns, contribute Ether securely, and manage spending requests through approval or finalization. The platform features a React-based web client for a seamless user experience.

---

## Features

- **Campaign Management**: Create and manage crowdfunding campaigns.
- **Contributions**: Contribute Ether to campaigns securely.
- **Request Approval**: Campaign managers can create spending requests, which contributors can approve.
- **Secure Transactions**: Funds are only transferred when the majority of contributors approve a request.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Ganache**: Local Ethereum blockchain.
- **MetaMask**: Browser extension for Ethereum wallets.

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd kickstart
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Compile Smart Contracts**:

   ```bash
   node ethereum/compile.js
   ```

4. **Deploy Contracts**:

   ```bash
   node ethereum/deploy.js
   ```

   Note the deployed `CampaignFactory` contract address for use in the application.

5. **Start Development Server**:

   ```bash
   npm run dev
   ```

6. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```plaintext
crowdfunding/
├── ethereum/
│   ├── Campaign.sol      # Solidity contract for campaigns
│   ├── compile.js        # Script to compile contracts
│   ├── deploy.js         # Script to deploy contracts
│   ├── factory.js        # Interacts with CampaignFactory contract
│   ├── campaign.js       # Interacts with individual Campaign contracts
│   └── web3.js           # Configures web3 instance
├── components/
│   ├── ContributeForm.js # Contribution form component
│   ├── Header.js         # Header component
│   ├── Layout.js         # Layout wrapper
│   └── RequestRow.js     # Component for displaying spending requests
├── pages/
│   ├── index.js          # Main page displaying campaigns
│   ├── campaigns/
│   │   ├── new.js        # Create a new campaign
│   │   └── [address].js  # Campaign details
├── routes/
│   ├── index.js          # Defines custom routes
├── package.json          # Project dependencies and scripts
└── README.md             # Documentation
```

---

## Key Files and Directories

### `ethereum/Campaign.sol`

- Smart contract for managing campaigns.
- Contains functionality for contributions, request creation, approval, and finalization.

### `ethereum/deploy.js`

- Script to deploy `CampaignFactory` to the Ethereum network.

### `pages/index.js`

- Displays a list of active campaigns.
- Users can view campaign details or create new campaigns.

### `components/ContributeForm.js`

- Form to contribute Ether to a specific campaign.

---

## Deployment

To deploy the application on a production network:

1. **Deploy Contracts**:
   Update `ethereum/deploy.js` with the production network provider (e.g., Infura) and deploy the contracts.

2. **Update Contract Address**:
   Update the deployed `CampaignFactory` address in `ethereum/factory.js`.

3. **Build the Application**:

   ```bash
   npm run build
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

---

## Smart Contract Functions

### CampaignFactory

- `createCampaign(uint minimum)`: Creates a new campaign.
- `getDeployedCampaigns()`: Returns a list of deployed campaigns.

### Campaign

- `contribute()`: Allows users to contribute Ether.
- `createRequest(string description, uint value, address recipient)`: Creates a spending request.
- `approveRequest(uint index)`: Approves a spending request.
- `finalizeRequest(uint index)`: Finalizes a request if it has majority approval.
- `getSummary()`: Returns a summary of the campaign details.
- `getRequestsCount()`: Returns the number of spending requests.

---

## Testing

Run tests with:

```bash
npm test
```

Ensure Ganache is running before executing tests. Test files are located in the `test` directory and include comprehensive cases for the smart contracts.

---

## Contributing

Feel free to fork the repository and submit pull requests. Ensure your changes are well-tested.

---

## License

This project is licensed under the MIT License.

---

## Notes

- Ensure MetaMask is connected to the correct network.
- Use the correct deployed contract address in `factory.js` for interacting with the blockchain.
- For additional help, consult Ethereum and Solidity documentation.
