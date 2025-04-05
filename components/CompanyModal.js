import React from 'react';
import {
  Modal,
  Label,
  Icon,
  Segment,
  Header,
  Grid,
  Statistic,
  Divider,
  Button,
} from 'semantic-ui-react';

const CompanyModal = ({
  isOpen,
  onClose,
  company,
  formatCurrency,
  formatNumber,
}) => {
  if (!company) return null;

  const isPositiveChange = company.change >= 0;
  const fundingPercentage = Math.round(
    (company.currentFunding / company.fundingGoal) * 100
  );

  return (
    <Modal open={isOpen} onClose={onClose} size="large" closeIcon>
      <Modal.Header>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            {company.name} ({company.symbol})
          </span>
          <Label color={isPositiveChange ? 'green' : 'red'} size="large">
            <Icon name={isPositiveChange ? 'arrow up' : 'arrow down'} />
            {formatCurrency(Math.abs(company.change))} ({company.changePercent}
            %)
          </Label>
        </div>
      </Modal.Header>

      <Modal.Content>
        <Segment>
          <Header as="h3">Company Overview</Header>
          <p>{company.description}</p>

          <Grid columns={3} divided stackable>
            <Grid.Row>
              <Grid.Column>
                <Statistic size="small">
                  <Statistic.Value>
                    {formatCurrency(company.buyPrice)}
                  </Statistic.Value>
                  <Statistic.Label>Buy Price</Statistic.Label>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="small">
                  <Statistic.Value>
                    {formatCurrency(company.sellPrice)}
                  </Statistic.Value>
                  <Statistic.Label>Sell Price</Statistic.Label>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="small">
                  <Statistic.Value>
                    {formatNumber(company.volume)}
                  </Statistic.Value>
                  <Statistic.Label>24h Volume</Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Divider />

          <Header as="h3">Funding Progress</Header>
          <Grid columns={2} stackable>
            <Grid.Row>
              <Grid.Column>
                <Statistic size="small">
                  <Statistic.Value>
                    {formatCurrency(company.currentFunding)}
                  </Statistic.Value>
                  <Statistic.Label>Current Funding</Statistic.Label>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="small">
                  <Statistic.Value>
                    {formatCurrency(company.fundingGoal)}
                  </Statistic.Value>
                  <Statistic.Label>Funding Goal</Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <div style={{ marginTop: '20px' }}>
            <Label
              color={fundingPercentage > 50 ? 'green' : 'orange'}
              size="large"
            >
              {fundingPercentage}% Funded
            </Label>
          </div>

          <Divider />

          <Header as="h3">Additional Information</Header>
          <Grid columns={2} stackable>
            <Grid.Row>
              <Grid.Column>
                <Statistic size="small">
                  <Statistic.Value>
                    {formatCurrency(company.marketCap)}
                  </Statistic.Value>
                  <Statistic.Label>Market Cap</Statistic.Label>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic size="small">
                  <Statistic.Value>
                    {company.campaignAddress.substring(0, 10)}...
                  </Statistic.Value>
                  <Statistic.Label>Campaign Address</Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Modal.Content>

      <Modal.Actions>
        <Button color="green" onClick={onClose}>
          <Icon name="shopping cart" /> Buy Shares
        </Button>
        <Button color="red" onClick={onClose}>
          <Icon name="dollar" /> Sell Shares
        </Button>
        <Button color="grey" onClick={onClose}>
          <Icon name="close" /> Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CompanyModal;
