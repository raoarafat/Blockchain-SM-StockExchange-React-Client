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
    struct Stock {
        string symbol;
        uint256 price;
        uint256 quantity;
    }
    
    struct Transaction {
        string symbol;
        uint256 price;
        uint256 quantity;
        uint256 timestamp;
        address trader;
        bool isBuy;
    }
    
    address public manager;
    mapping(string => Stock) public stocks;
    mapping(address => mapping(string => uint256)) public portfolios;
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
    
    function addStock(string memory symbol, uint256 price, uint256 quantity) public onlyManager {
        require(stocks[symbol].quantity == 0, "Stock already exists");
        stocks[symbol] = Stock(symbol, price, quantity);
    }
    
    function updateStockPrice(string memory symbol, uint256 newPrice) public onlyManager {
        require(stocks[symbol].quantity > 0, "Stock does not exist");
        stocks[symbol].price = newPrice;
    }
    
    function buyStock(string memory symbol, uint256 quantity) public payable {
        Stock storage stock = stocks[symbol];
        require(stock.quantity > 0, "Stock does not exist");
        require(quantity <= stock.quantity, "Not enough stocks available");
        require(msg.value >= stock.price * quantity, "Insufficient payment");
        
        stock.quantity -= quantity;
        portfolios[msg.sender][symbol] += quantity;
        
        // Record transaction
        transactions.push(Transaction({
            symbol: symbol,
            price: stock.price,
            quantity: quantity,
            timestamp: block.timestamp,
            trader: msg.sender,
            isBuy: true
        }));
        
        emit StockPurchased(msg.sender, symbol, quantity, stock.price);
    }
    
    function sellStock(string memory symbol, uint256 quantity) public {
        Stock storage stock = stocks[symbol];
        require(stock.quantity > 0, "Stock does not exist");
        require(portfolios[msg.sender][symbol] >= quantity, "Not enough stocks in portfolio");
        
        uint256 payment = stock.price * quantity;
        
        portfolios[msg.sender][symbol] -= quantity;
        stock.quantity += quantity;
        
        // Record transaction
        transactions.push(Transaction({
            symbol: symbol,
            price: stock.price,
            quantity: quantity,
            timestamp: block.timestamp,
            trader: msg.sender,
            isBuy: false
        }));
        
        payable(msg.sender).transfer(payment);
        emit StockSold(msg.sender, symbol, quantity, stock.price);
    }
    
    // View functions for transaction history
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
    
    function getBuyTransactions() public view returns (Transaction[] memory) {
        uint256 buyCount = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].isBuy) buyCount++;
        }
        
        Transaction[] memory buyTxs = new Transaction[](buyCount);
        uint256 currentIndex = 0;
        
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].isBuy) {
                buyTxs[currentIndex] = transactions[i];
                currentIndex++;
            }
        }
        
        return buyTxs;
    }
    
    function getSellTransactions() public view returns (Transaction[] memory) {
        uint256 sellCount = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (!transactions[i].isBuy) sellCount++;
        }
        
        Transaction[] memory sellTxs = new Transaction[](sellCount);
        uint256 currentIndex = 0;
        
        for (uint i = 0; i < transactions.length; i++) {
            if (!transactions[i].isBuy) {
                sellTxs[currentIndex] = transactions[i];
                currentIndex++;
            }
        }
        
        return sellTxs;
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
    
    function getPortfolioBalance(address user, string memory symbol) public view returns (uint256) {
        return portfolios[user][symbol];
    }
}
