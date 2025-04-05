import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PortfolioContext = createContext();

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
      localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(portfolio));
    }
  }, [portfolio, user]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user && transactions.length > 0) {
      localStorage.setItem(
        `transactions_${user.id}`,
        JSON.stringify(transactions)
      );
    }
  }, [transactions, user]);

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

  const sellStock = (company, quantity, price) => {
    if (!user) return { success: false, message: 'User not logged in' };

    // Check if user owns this stock
    const existingPosition = portfolio.find(
      (item) => item.symbol === company.symbol
    );

    if (!existingPosition) {
      return {
        success: false,
        message: 'You do not own any shares of this stock',
      };
    }

    // Check if user owns enough shares
    if (existingPosition.quantity < quantity) {
      return {
        success: false,
        message: `You only own ${existingPosition.quantity} shares`,
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

    // Update portfolio
    let updatedPortfolio;
    if (existingPosition.quantity === quantity) {
      // Remove position entirely if selling all shares
      updatedPortfolio = portfolio.filter(
        (item) => item.symbol !== company.symbol
      );
    } else {
      // Update quantity if selling some shares
      updatedPortfolio = portfolio.map((item) =>
        item.symbol === company.symbol
          ? { ...item, quantity: item.quantity - quantity }
          : item
      );
    }

    setPortfolio(updatedPortfolio);

    // Record transaction
    const transaction = {
      id: Date.now().toString(),
      type: 'sell',
      symbol: company.symbol,
      name: company.name,
      quantity: quantity,
      price: price,
      total: totalValue,
      date: new Date().toISOString(),
    };

    setTransactions([transaction, ...transactions]);

    return { success: true, message: 'Sale successful' };
  };

  const getStockPosition = (symbol) => {
    return portfolio.find((item) => item.symbol === symbol) || null;
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        transactions,
        buyStock,
        sellStock,
        getStockPosition,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
