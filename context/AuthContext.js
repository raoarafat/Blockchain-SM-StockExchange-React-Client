import React, { createContext, useState, useContext, useEffect } from 'react';
import Router from 'next/router';
import investorsData from '../data/investors.json';
import web3 from '../ethereum/web3';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Add hardcoded MetaMask address to user data
      setUser({
        ...userData,
        address: '0x40E2F8ff22D7D63Ca74DFf9D035F09F0e10fBFcC', // Replace with your MetaMask address
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Find the investor with matching credentials
    const investor = investorsData.find(
      (inv) => inv.email === email && inv.password === password
    );

    if (investor) {
      try {
        // Add hardcoded MetaMask address
        const userWithAddress = {
          ...investor,
          address: '0x40E2F8ff22D7D63Ca74DFf9D035F09F0e10fBFcC', // Replace with your MetaMask address
        };

        // Remove password from stored data
        const { password: _, ...userWithoutPassword } = userWithAddress;

        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      } catch (error) {
        console.error('Error setting up user with address:', error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    Router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
