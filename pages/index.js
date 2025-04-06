// pages/index.js or pages/index.tsx (or whichever file you are using for the page)
import React, { useState } from 'react';
import factory from '../ethereum/factory';
import { Button, Container, Icon, Menu, Dropdown } from 'semantic-ui-react';
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
        />

        <SellStockModal
          isOpen={sellModalOpen}
          onClose={handleSellModalClose}
          company={selectedCompany}
        />
      </Container>
    </ProtectedRoute>
  );
};

export default CampaignIndex;
