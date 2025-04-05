import React, { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Icon,
  Segment,
  Header,
  Statistic,
  Divider,
  Message,
} from 'semantic-ui-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

const BuyStockModal = ({ isOpen, onClose, company }) => {
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!company) return null;

  const totalCost = quantity * company.buyPrice;

  const handleQuantityChange = (e, { value }) => {
    // Ensure quantity is a positive number
    const newQuantity = Math.max(1, parseInt(value) || 1);
    setQuantity(newQuantity);
  };

  const handleBuyClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmBuy = () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      onClose();
      // Here you would typically update your state or call a callback
      // to inform the parent component that the purchase was successful
    }, 1500);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const resetAndClose = () => {
    setQuantity(1);
    setShowConfirmation(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={resetAndClose} size="small" closeIcon>
      <Modal.Header>
        <Icon name="shopping cart" /> Buy {company.name} ({company.symbol})
        Shares
      </Modal.Header>

      <Modal.Content>
        {!showConfirmation ? (
          <Segment>
            <Header as="h3">Stock Information</Header>
            <Statistic.Group size="small" widths="three">
              <Statistic color="green">
                <Statistic.Value>
                  {formatCurrency(company.buyPrice)}
                </Statistic.Value>
                <Statistic.Label>Current Price</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {formatNumber(company.volume)}
                </Statistic.Value>
                <Statistic.Label>24h Volume</Statistic.Label>
              </Statistic>
              <Statistic color={company.change >= 0 ? 'green' : 'red'}>
                <Statistic.Value>
                  <Icon
                    name={company.change >= 0 ? 'arrow up' : 'arrow down'}
                  />
                  {company.changePercent}%
                </Statistic.Value>
                <Statistic.Label>24h Change</Statistic.Label>
              </Statistic>
            </Statistic.Group>

            <Divider />

            <Form>
              <Form.Field>
                <label>Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  fluid
                  label={{ basic: true, content: 'shares' }}
                  labelPosition="right"
                />
              </Form.Field>

              <Segment>
                <Header as="h4">Order Summary</Header>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0',
                  }}
                >
                  <div>Price per share:</div>
                  <div>{formatCurrency(company.buyPrice)}</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0',
                  }}
                >
                  <div>Quantity:</div>
                  <div>{quantity} shares</div>
                </div>
                <Divider />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0',
                    fontWeight: 'bold',
                  }}
                >
                  <div>Total Cost:</div>
                  <div>{formatCurrency(totalCost)}</div>
                </div>
              </Segment>
            </Form>
          </Segment>
        ) : (
          <Segment>
            <Message warning>
              <Message.Header>Confirm Your Purchase</Message.Header>
              <p>
                You are about to purchase {quantity} shares of {company.symbol}{' '}
                at {formatCurrency(company.buyPrice)} per share.
              </p>
              <p>Total cost: {formatCurrency(totalCost)}</p>
              <p>Do you want to proceed with this transaction?</p>
            </Message>
          </Segment>
        )}
      </Modal.Content>

      <Modal.Actions>
        {!showConfirmation ? (
          <>
            <Button color="grey" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button color="green" onClick={handleBuyClick}>
              <Icon name="shopping cart" /> Buy Shares
            </Button>
          </>
        ) : (
          <>
            <Button color="grey" onClick={handleCancel} disabled={isProcessing}>
              Back
            </Button>
            <Button
              color="green"
              onClick={handleConfirmBuy}
              loading={isProcessing}
              disabled={isProcessing}
            >
              <Icon name="check" /> Confirm Purchase
            </Button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default BuyStockModal;
