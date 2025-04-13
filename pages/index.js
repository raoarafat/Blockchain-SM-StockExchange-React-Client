// pages/index.js or pages/index.tsx (or whichever file you are using for the page)
import React, { useState } from 'react';
import { Container, Icon, Menu, Dropdown, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import 'semantic-ui-css/semantic.min.css';
import companiesData from '../data/companies.json';
import CompaniesTable from '../components/CompaniesTable';
import CompanyModal from '../components/CompanyModal';
import BuyStockModal from '../components/BuyStockModal';
import SellStockModal from '../components/SellStockModal';
import { formatCurrency, formatNumber } from '../utils/formatters';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { pageStyles } from '../styles/global';

const CampaignIndex = () => {
  const [state, setState] = useState({
    viewModalOpen: false,
    buyModalOpen: false,
    sellModalOpen: false,
    selectedCompany: null,
  });

  const { user, logout } = useAuth();
  // Use your deployed StockExchange contract address here
  const exchangeAddress = '0xDc5B1E3393316E6C83C0d4676b7E66951E35ADD7';
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

  return (
    <ProtectedRoute>
      <Header activeItem="market" />

      <Container style={pageStyles.container}>
        <h2>
          <Icon name="chart line" />
          Stock Market
        </h2>

        {error ? (
          <Message negative>
            <Message.Header>Error</Message.Header>
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
