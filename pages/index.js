// pages/index.js or pages/index.tsx (or whichever file you are using for the page)
import React, { useState } from 'react';
import { Container, Icon, Menu, Dropdown, Message } from 'semantic-ui-react';
import Layout from '../components/layout';
import 'semantic-ui-css/semantic.min.css';
import companiesData from '../data/companies.json';
import CompaniesTable from '../components/CompaniesTable';
import CompanyModal from '../components/CompanyModal';
import BuyStockModal from '../components/BuyStockModal';
import SellStockModal from '../components/SellStockModal';
import { formatCurrency, formatNumber } from '../utils/formatters';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const CampaignIndex = () => {
  const [state, setState] = useState({
    viewModalOpen: false,
    buyModalOpen: false,
    sellModalOpen: false,
    selectedCompany: null,
  });

  const { user, logout } = useAuth();
  // Use your deployed StockExchange contract address here
  const exchangeAddress = '0x39F0aa60b0cc89B404bc7e90DAb8AcE97Ee76020';
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
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" header>
            <Icon name="chart line" />
            Stock Trading App
          </Menu.Item>
          <Menu.Item as="a" href="/">
            Market
          </Menu.Item>
          <Menu.Item as="a" href="/portfolio">
            Portfolio
          </Menu.Item>

          <Menu.Menu position="right">
            {user && (
              <Menu.Item>
                <Icon name="user" />
                {user.name} | {formatCurrency(user.fund)}
              </Menu.Item>
            )}
            <Dropdown item text="Account">
              <Dropdown.Menu>
                {user ? (
                  <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                ) : (
                  <Dropdown.Item href="/login">Login</Dropdown.Item>
                )}
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
