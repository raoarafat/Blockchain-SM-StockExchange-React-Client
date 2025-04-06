// pages/index.js or pages/index.tsx (or whichever file you are using for the page)
import React, { useState, useEffect } from 'react';
import factory from '../ethereum/factory';
import {
  Button,
  Container,
  Icon,
  Menu,
  Dropdown,
  Message,
} from 'semantic-ui-react';
import Layout from '../components/layout';
import { Link } from '../routes';
import 'semantic-ui-css/semantic.min.css';
import companiesData from '../data/companies.json';
import CompaniesTable from '../components/CompaniesTable';
import CompanyModal from '../components/CompanyModal';
import BuyStockModal from '../components/BuyStockModal';
import SellStockModal from '../components/SellStockModal';
import { formatCurrency, formatNumber } from '../utils/formatters';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { blockchainService } from '../services/blockchainService';
import { initializeStocks } from '../utils/initializeStocks';

// Note: The findDOMNode warning comes from Semantic UI React library
// This is a known issue with older versions of the library
// It doesn't affect functionality but could be addressed by updating the library in the future

const CampaignIndex = () => {
  const [state, setState] = useState({
    viewModalOpen: false,
    buyModalOpen: false,
    sellModalOpen: false,
    selectedCompany: null,
  });

  const { user, logout } = useAuth();
  const [exchangeAddress, setExchangeAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewModalOpen = (company) => {
    setState({ ...state, viewModalOpen: true, selectedCompany: company });
  };

  const handleViewModalClose = () => {
    setState({ ...state, viewModalOpen: false });
  };

  const handleBuyModalOpen = (company) => {
    setState({ ...state, buyModalOpen: true, selectedCompany: company });
  };

  const handleBuyModalClose = () => {
    setState({ ...state, buyModalOpen: false });
  };

  const handleSellModalOpen = (company) => {
    setState({ ...state, sellModalOpen: true, selectedCompany: company });
  };

  const handleSellModalClose = () => {
    setState({ ...state, sellModalOpen: false });
  };

  const { viewModalOpen, buyModalOpen, sellModalOpen, selectedCompany } = state;

  // Fetch the deployed exchange address when the component mounts
  useEffect(() => {
    const fetchExchangeAddress = async () => {
      try {
        setIsLoading(true);
        const result = await blockchainService.getDeployedExchanges();

        if (result.success && result.exchanges.length > 0) {
          setExchangeAddress(result.exchanges[0]); // Use the first exchange
        } else {
          // If no exchange exists, create one
          const createResult = await blockchainService.createExchange();
          if (createResult.success) {
            // Fetch the newly created exchange
            const newResult = await blockchainService.getDeployedExchanges();
            if (newResult.success && newResult.exchanges.length > 0) {
              setExchangeAddress(newResult.exchanges[0]);
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeAddress();
  }, []);

  useEffect(() => {
    const setupExchange = async () => {
      if (!exchangeAddress) return;

      try {
        // Check if any stocks exist in the exchange
        const testStock = companiesData[0];
        const stockResult = await blockchainService.getStockInfo(
          exchangeAddress,
          testStock.symbol
        );

        // If the stock doesn't exist, initialize all stocks
        if (!stockResult.success || stockResult.stock.quantity === '0') {
          await initializeStocks(exchangeAddress);
        }
      } catch (error) {
        console.error('Error setting up exchange:', error);
      }
    };

    setupExchange();
  }, [exchangeAddress]);

  return (
    <ProtectedRoute>
      <Menu attached="top" inverted color="teal">
        <Container>
          <Menu.Item header>
            <Icon name="chart line" />
            Stock Exchange
          </Menu.Item>

          <Menu.Item active as={Link} route="/">
            <Icon name="exchange" />
            Market
          </Menu.Item>

          <Menu.Item as={Link} route="/portfolio">
            <Icon name="briefcase" />
            Portfolio
          </Menu.Item>

          <Menu.Menu position="right">
            <Dropdown item text={`Welcome, ${user?.name}`}>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Icon name="money" />
                  Balance: {formatCurrency(user?.fund)}
                </Dropdown.Item>
                <Dropdown.Item onClick={logout}>
                  <Icon name="sign out" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>

      <Container style={{ marginTop: '2em' }}>
        <h2>
          <Icon name="chart line" />
          Stock Market
        </h2>

        {isLoading ? (
          <div>Loading exchange data...</div>
        ) : error ? (
          <Message negative>
            <Message.Header>Error loading exchange</Message.Header>
            <p>{error}</p>
          </Message>
        ) : (
          <>
            <CompaniesTable
              companies={companiesData}
              onViewCompany={handleViewModalOpen}
              onBuyCompany={handleBuyModalOpen}
              onSellCompany={handleSellModalOpen}
            />

            <CompanyModal
              isOpen={viewModalOpen}
              onClose={handleViewModalClose}
              company={selectedCompany}
              formatCurrency={formatCurrency}
              formatNumber={formatNumber}
            />

            <BuyStockModal
              isOpen={buyModalOpen}
              onClose={handleBuyModalClose}
              company={selectedCompany}
              exchangeAddress={exchangeAddress}
            />

            <SellStockModal
              isOpen={sellModalOpen}
              onClose={handleSellModalClose}
              company={selectedCompany}
              exchangeAddress={exchangeAddress}
            />
          </>
        )}
      </Container>
    </ProtectedRoute>
  );
};

export default CampaignIndex;
