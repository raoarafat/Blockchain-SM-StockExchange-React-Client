import React from 'react';
import { Table, Label, Icon, Button } from 'semantic-ui-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

const CompaniesTable = ({
  companies,
  onViewCompany,
  onBuyCompany,
  onSellCompany,
}) => {
  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Symbol</Table.HeaderCell>
          <Table.HeaderCell>Company</Table.HeaderCell>
          <Table.HeaderCell>Buy Price</Table.HeaderCell>
          <Table.HeaderCell>Sell Price</Table.HeaderCell>
          <Table.HeaderCell>Change</Table.HeaderCell>
          <Table.HeaderCell>Volume</Table.HeaderCell>
          <Table.HeaderCell>Market Cap</Table.HeaderCell>
          <Table.HeaderCell>Funding</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {companies.map((company) => {
          const isPositiveChange = company.change >= 0;
          const fundingPercentage = Math.round(
            (company.currentFunding / company.fundingGoal) * 100
          );

          return (
            <Table.Row key={company.id}>
              <Table.Cell>
                <strong>{company.symbol}</strong>
              </Table.Cell>
              <Table.Cell>{company.name}</Table.Cell>
              <Table.Cell positive>
                {formatCurrency(company.buyPrice)}
              </Table.Cell>
              <Table.Cell negative>
                {formatCurrency(company.sellPrice)}
              </Table.Cell>
              <Table.Cell
                positive={isPositiveChange}
                negative={!isPositiveChange}
              >
                <Icon name={isPositiveChange ? 'arrow up' : 'arrow down'} />
                {formatCurrency(Math.abs(company.change))} (
                {company.changePercent}%)
              </Table.Cell>
              <Table.Cell>{formatNumber(company.volume)}</Table.Cell>
              <Table.Cell>{formatCurrency(company.marketCap)}</Table.Cell>
              <Table.Cell>
                <Label
                  color={fundingPercentage > 50 ? 'green' : 'orange'}
                  ribbon
                >
                  {fundingPercentage}% of {formatCurrency(company.fundingGoal)}
                </Label>
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="small"
                  primary
                  onClick={() => onViewCompany(company)}
                >
                  <Icon name="eye" />
                  View
                </Button>
                <Button
                  size="small"
                  color="green"
                  onClick={() => onBuyCompany(company)}
                >
                  <Icon name="shopping cart" />
                  Buy
                </Button>
                <Button
                  size="small"
                  color="red"
                  onClick={() => onSellCompany(company)}
                >
                  <Icon name="dollar" />
                  Sell
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default CompaniesTable;
