import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Header,
  Icon,
  Segment,
  Statistic,
  Button,
  Message,
  Menu,
  Dropdown,
} from 'semantic-ui-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { Link } from '../routes';
import { blockchainService } from '../services/blockchainService';
import companiesData from '../data/companies.json';
import Layout from '../components/Layout';
import { pageStyles } from '../styles/global';
import web3 from '../ethereum/web3';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, login } = useAuth();

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (user?.address) {
        try {
          setLoading(true);
          const [positions, txns] = await Promise.all([
            blockchainService.getPortfolioPositions(user.address),
            blockchainService.getUserTransactions(user.address),
          ]);

          // Transform blockchain data to match UI requirements
          const formattedPositions = positions.map((pos) => ({
            ...pos,
            name:
              companiesData.find((c) => c.symbol === pos.symbol)?.name ||
              pos.symbol,
          }));

          const formattedTransactions = txns.map((tx) => ({
            id: `${tx.timestamp}-${tx.symbol}`,
            type: tx.isBuy ? 'buy' : 'sell',
            symbol: tx.symbol,
            name:
              companiesData.find((c) => c.symbol === tx.symbol)?.name ||
              tx.symbol,
            quantity: parseInt(tx.quantity),
            price: parseFloat(web3.utils.fromWei(tx.price, 'ether')),
            total:
              parseFloat(web3.utils.fromWei(tx.price, 'ether')) *
              parseInt(tx.quantity),
            date: tx.date,
          }));

          setPortfolio(formattedPositions);
          setTransactions(formattedTransactions);
        } catch (error) {
          console.error('Error loading blockchain data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBlockchainData();
  }, [user]);

  if (!user) {
    return (
      <Container style={pageStyles.container}>
        <Message warning>
          <Message.Header>Wallet Connection Required</Message.Header>
          <p>Please connect your MetaMask wallet to view your portfolio.</p>
          <Button primary onClick={login}>
            <Icon name="plug" />
            Connect Wallet
          </Button>
        </Message>
      </Container>
    );
  }

  if (!user.address) {
    return (
      <Container style={pageStyles.container}>
        <Message warning>
          <Message.Header>MetaMask Connection Required</Message.Header>
          <p>Please connect your MetaMask wallet to continue.</p>
          <Button primary onClick={login}>
            <Icon name="plug" />
            Connect MetaMask
          </Button>
        </Message>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container style={pageStyles.container}>
        <Segment loading>
          <Header as="h2">Loading portfolio data...</Header>
        </Segment>
      </Container>
    );
  }

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, position) => {
      return total + position.quantity * position.averagePrice;
    }, 0);
  };

  // Calculate total profit/loss
  const calculateTotalProfitLoss = () => {
    return portfolio.reduce((total, position) => {
      const latestPrice = position.averagePrice; // You might want to get current market price here
      const currentValue = position.quantity * latestPrice;
      const costBasis = position.quantity * position.averagePrice;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const portfolioValue = calculatePortfolioValue();
  const totalProfitLoss = calculateTotalProfitLoss();
  const totalAssets = user.fund + portfolioValue;

  return (
    <Layout activeItem="portfolio">
      <Container style={pageStyles.container}>
        <Header as="h2">
          <Icon name="briefcase" />
          <Header.Content>
            Your Portfolio
            <Header.Subheader>Manage your investments</Header.Subheader>
          </Header.Content>
        </Header>

        <Segment>
          <Statistic.Group widths="four">
            <Statistic>
              <Statistic.Value>{formatCurrency(user.fund)}</Statistic.Value>
              <Statistic.Label>Cash Balance</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>
                {formatCurrency(portfolioValue)}
              </Statistic.Value>
              <Statistic.Label>Portfolio Value</Statistic.Label>
            </Statistic>
            <Statistic color={totalProfitLoss >= 0 ? 'green' : 'red'}>
              <Statistic.Value>
                {totalProfitLoss >= 0 ? '+' : ''}
                {formatCurrency(totalProfitLoss)}
              </Statistic.Value>
              <Statistic.Label>Total Profit/Loss</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>{formatCurrency(totalAssets)}</Statistic.Value>
              <Statistic.Label>Total Assets</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment>

        <Header as="h3">Your Holdings</Header>

        {portfolio.length === 0 ? (
          <Message info>
            <Message.Header>No stocks in your portfolio</Message.Header>
            <p>Go to the stock exchange to start investing!</p>
            <Link route="/" legacyBehavior>
              <a>
                <Button primary>
                  <Icon name="exchange" />
                  Go to Stock Exchange
                </Button>
              </a>
            </Link>
          </Message>
        ) : (
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>Company</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Average Price</Table.HeaderCell>
                <Table.HeaderCell>Current Price</Table.HeaderCell>
                <Table.HeaderCell>Market Value</Table.HeaderCell>
                <Table.HeaderCell>Profit/Loss</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {portfolio.map((position) => {
                const company = companiesData.find(
                  (c) => c.symbol === position.symbol
                );
                if (!company) return null;

                const currentValue = position.quantity * company.sellPrice;
                const costBasis = position.quantity * position.averagePrice;
                const profitLoss = currentValue - costBasis;
                const profitLossPercent = (profitLoss / costBasis) * 100;

                return (
                  <Table.Row key={position.symbol}>
                    <Table.Cell>
                      <strong>{position.symbol}</strong>
                    </Table.Cell>
                    <Table.Cell>{position.name}</Table.Cell>
                    <Table.Cell>{position.quantity}</Table.Cell>
                    <Table.Cell>
                      {formatCurrency(position.averagePrice)}
                    </Table.Cell>
                    <Table.Cell>{formatCurrency(company.sellPrice)}</Table.Cell>
                    <Table.Cell>{formatCurrency(currentValue)}</Table.Cell>
                    <Table.Cell
                      positive={profitLoss >= 0}
                      negative={profitLoss < 0}
                    >
                      <Icon
                        name={profitLoss >= 0 ? 'arrow up' : 'arrow down'}
                      />
                      {formatCurrency(Math.abs(profitLoss))} (
                      {profitLossPercent.toFixed(2)}%)
                    </Table.Cell>
                    <Table.Cell>
                      <Link route="/" legacyBehavior>
                        <a>
                          <Button size="tiny" primary>
                            <Icon name="exchange" />
                            Trade
                          </Button>
                        </a>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}

        <Header as="h3" style={{ marginTop: '2em' }}>
          Recent Transactions
        </Header>

        {transactions.length === 0 ? (
          <Message info>
            <Message.Header>No transaction history</Message.Header>
            <p>Your trading activity will appear here.</p>
          </Message>
        ) : (
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>Company</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactions.slice(0, 10).map((transaction) => (
                <Table.Row key={transaction.id}>
                  <Table.Cell>
                    {new Date(transaction.date).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell
                    positive={transaction.type === 'sell'}
                    negative={transaction.type === 'buy'}
                  >
                    <Icon
                      name={
                        transaction.type === 'buy' ? 'shopping cart' : 'dollar'
                      }
                    />
                    {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                  </Table.Cell>
                  <Table.Cell>
                    <strong>{transaction.symbol}</strong>
                  </Table.Cell>
                  <Table.Cell>{transaction.name}</Table.Cell>
                  <Table.Cell>{transaction.quantity}</Table.Cell>
                  <Table.Cell>{formatCurrency(transaction.price)}</Table.Cell>
                  <Table.Cell>{formatCurrency(transaction.total)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Container>
    </Layout>
  );
};

export default Portfolio;
