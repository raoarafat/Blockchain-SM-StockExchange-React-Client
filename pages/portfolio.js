import React from 'react';
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
import Layout from '../components/layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { Link } from '../routes';
import companiesData from '../data/companies.json';

const Portfolio = () => {
  const { portfolio, transactions } = usePortfolio();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, position) => {
      const company = companiesData.find((c) => c.symbol === position.symbol);
      if (company) {
        return total + position.quantity * company.sellPrice;
      }
      return total;
    }, 0);
  };

  // Calculate total profit/loss
  const calculateTotalProfitLoss = () => {
    return portfolio.reduce((total, position) => {
      const company = companiesData.find((c) => c.symbol === position.symbol);
      if (company) {
        const currentValue = position.quantity * company.sellPrice;
        const costBasis = position.quantity * position.averagePrice;
        return total + (currentValue - costBasis);
      }
      return total;
    }, 0);
  };

  const portfolioValue = calculatePortfolioValue();
  const totalProfitLoss = calculateTotalProfitLoss();
  const totalAssets = user.fund + portfolioValue;

  return (
    <ProtectedRoute>
      <Menu attached="top" inverted color="teal">
        <Container>
          <Menu.Item header>
            <Icon name="chart line" />
            Stock Exchange
          </Menu.Item>

          <Menu.Item as={Link} route="/">
            <Icon name="exchange" />
            Market
          </Menu.Item>

          <Menu.Item active as={Link} route="/portfolio">
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
    </ProtectedRoute>
  );
};

export default Portfolio;
