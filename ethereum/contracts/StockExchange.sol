// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0; // Update to 0.8.x version

contract StockExchangeFactory {
    address[] public deployedExchanges;
    
    function createExchange() public {
        address newExchange = address(new StockExchange(msg.sender));
        deployedExchanges.push(newExchange);
    }
    
    function getDeployedExchanges() public view returns (address[] memory) {
        return deployedExchanges;
    }
}

contract StockExchange {
    struct Transaction {
        string symbol;
        uint256 price;
        uint256 quantity;
        uint256 timestamp;
        address trader;
        bool isBuy;
    }
    
    address public manager;
    Transaction[] public transactions;
    
    event StockPurchased(address indexed buyer, string symbol, uint256 quantity, uint256 price);
    event StockSold(address indexed seller, string symbol, uint256 quantity, uint256 price);
    
    constructor(address creator) {
        manager = creator;
    }
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can perform this action");
        _;
    }
    
    // Record a buy transaction on the blockchain
    function recordBuyTransaction(string memory symbol, uint256 price, uint256 quantity) public {
        transactions.push(Transaction({
            symbol: symbol,
            price: price,
            quantity: quantity,
            timestamp: block.timestamp,
            trader: msg.sender,
            isBuy: true
        }));
        
        emit StockPurchased(msg.sender, symbol, quantity, price);
    }
    
    // Record a sell transaction on the blockchain
    function recordSellTransaction(string memory symbol, uint256 price, uint256 quantity) public {
        transactions.push(Transaction({
            symbol: symbol,
            price: price,
            quantity: quantity,
            timestamp: block.timestamp,
            trader: msg.sender,
            isBuy: false
        }));
        
        emit StockSold(msg.sender, symbol, quantity, price);
    }
    
    // View functions for transaction history
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
    
    function getUserTransactions(address user) public view returns (Transaction[] memory) {
        uint256 userTxCount = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].trader == user) userTxCount++;
        }
        
        Transaction[] memory userTxs = new Transaction[](userTxCount);
        uint256 currentIndex = 0;
        
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].trader == user) {
                userTxs[currentIndex] = transactions[i];
                currentIndex++;
            }
        }
        
        return userTxs;
    }
}
