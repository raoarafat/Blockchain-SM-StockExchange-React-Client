import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { blockchainService } from '../services/BlockchainService';

const PortfolioContext = createContext();

const serializeBigInt = (data) => {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

export const PortfolioProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Load portfolio from localStorage when component mounts
    if (user) {
      const storedPortfolio = localStorage.getItem(`portfolio_${user.id}`);
      const storedTransactions = localStorage.getItem(
        `transactions_${user.id}`
      );

      if (storedPortfolio) {
        setPortfolio(JSON.parse(storedPortfolio));
      }

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    }
  }, [user]);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (user && portfolio.length > 0) {
      localStorage.setItem(`portfolio_${user.id}`, serializeBigInt(portfolio));
    }
  }, [portfolio, user]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user && transactions.length > 0) {
      localStorage.setItem(
        `transactions_${user.id}`,
        serializeBigInt(transactions)
      );
    }
  }, [transactions, user]);

  const refreshPortfolioData = async () => {
    if (user?.address) {
      try {
        const [positions, txns] = await Promise.all([
          blockchainService.getPortfolioPositions(user.address),
          blockchainService.getUserTransactions(user.address),
        ]);

        // Convert BigInt values to strings before setting state
        const processedPositions = positions.map((pos) => ({
          ...pos,
          price:
            typeof pos.price === 'bigint' ? pos.price.toString() : pos.price,
          totalCost:
            typeof pos.totalCost === 'bigint'
              ? pos.totalCost.toString()
              : pos.totalCost,
          averagePrice:
            typeof pos.averagePrice === 'bigint'
              ? pos.averagePrice.toString()
              : pos.averagePrice,
        }));

        const processedTransactions = txns.map((tx) => ({
          ...tx,
          price: typeof tx.price === 'bigint' ? tx.price.toString() : tx.price,
          total: typeof tx.total === 'bigint' ? tx.total.toString() : tx.total,
        }));

        setPortfolio(processedPositions);
        setTransactions(processedTransactions);
      } catch (error) {
        console.error('Error refreshing portfolio data:', error);
      }
    }
  };

  const buyStock = (company, quantity, price) => {
    if (!user) return { success: false, message: 'User not logged in' };

    const totalCost = quantity * price;

    // Check if user has enough funds
    if (user.fund < totalCost) {
      return { success: false, message: 'Insufficient funds' };
    }

    // Update user's funds
    const updatedUser = {
      ...user,
      fund: user.fund - totalCost,
    };

    // Update localStorage and context
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Check if user already owns this stock
    const existingPosition = portfolio.find(
      (item) => item.symbol === company.symbol
    );

    let updatedPortfolio;
    if (existingPosition) {
      // Update existing position
      const newQuantity = existingPosition.quantity + quantity;
      const newAveragePrice =
        (existingPosition.quantity * existingPosition.averagePrice +
          quantity * price) /
        newQuantity;

      updatedPortfolio = portfolio.map((item) =>
        item.symbol === company.symbol
          ? { ...item, quantity: newQuantity, averagePrice: newAveragePrice }
          : item
      );
    } else {
      // Add new position
      updatedPortfolio = [
        ...portfolio,
        {
          symbol: company.symbol,
          name: company.name,
          quantity: quantity,
          averagePrice: price,
        },
      ];
    }

    setPortfolio(updatedPortfolio);

    // Record transaction
    const transaction = {
      id: Date.now().toString(),
      type: 'buy',
      symbol: company.symbol,
      name: company.name,
      quantity: quantity,
      price: price,
      total: totalCost,
      date: new Date().toISOString(),
    };

    setTransactions([transaction, ...transactions]);

    return { success: true, message: 'Purchase successful' };
  };

  const sellStock = async (company, quantity, price) => {
    if (!user) return { success: false, message: 'User not logged in' };

    try {
      // Get current position from blockchain
      const position = await blockchainService
        .getPortfolioPositions(user.address)
        .then((positions) =>
          positions.find((pos) => pos.symbol === company.symbol)
        );

      if (!position) {
        return {
          success: false,
          message: 'You do not own any shares of this stock',
        };
      }

      if (position.quantity < quantity) {
        return {
          success: false,
          message: `You only own ${position.quantity} shares`,
        };
      }

      const totalValue = quantity * price;

      // Update user's funds
      const updatedUser = {
        ...user,
        fund: user.fund + totalValue,
      };

      // Update localStorage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // After successful sell, refresh the data
      await refreshPortfolioData();

      return { success: true, message: 'Sale successful' };
    } catch (error) {
      console.error('Error in sellStock:', error);
      return { success: false, message: error.message };
    }
  };

  const getStockPosition = async (symbol) => {
    if (!user?.address) return null;

    try {
      const positions = await blockchainService.getPortfolioPositions(
        user.address
      );
      return positions.find((pos) => pos.symbol === symbol) || null;
    } catch (error) {
      console.error('Error getting stock position:', error);
      return null;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        transactions,
        buyStock,
        sellStock,
        getStockPosition,
        refreshPortfolioData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
