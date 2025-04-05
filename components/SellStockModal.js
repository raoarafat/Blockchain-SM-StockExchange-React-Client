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

const SellStockModal = ({ isOpen, onClose, company }) => {
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!company) return null;

  const totalValue = quantity * company.sellPrice;

  const handleQuantityChange = (e, { value }) => {
    // Ensure quantity is a positive number
    const newQuantity = Math.max(1, parseInt(value) || 1);
    setQuantity(newQuantity);
  };

  const handleSellClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSell = () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      onClose();
      // Here you would typically update your state or call a callback
      // to inform the parent component that the sale was successful
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
        <Icon name="dollar" /> Sell {company.name} ({company.symbol}) Shares
      </Modal.Header>

      <Modal.Content>
        {!showConfirmation ? (
          <Segment>
            <Header as="h3">Stock Information</Header>
            <Statistic.Group size="small" widths="three">
              <Statistic color="red">
                <Statistic.Value>
                  {formatCurrency(company.sellPrice)}
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
                  <div>{formatCurrency(company.sellPrice)}</div>
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
                  <div>Total Value:</div>
                  <div>{formatCurrency(totalValue)}</div>
                </div>
              </Segment>
            </Form>
          </Segment>
        ) : (
          <Segment>
            <Message warning>
              <Message.Header>Confirm Your Sale</Message.Header>
              <p>
                You are about to sell {quantity} shares of {company.symbol} at{' '}
                {formatCurrency(company.sellPrice)} per share.
              </p>
              <p>Total value: {formatCurrency(totalValue)}</p>
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
            <Button color="red" onClick={handleSellClick}>
              <Icon name="dollar" /> Sell Shares
            </Button>
          </>
        ) : (
          <>
            <Button color="grey" onClick={handleCancel} disabled={isProcessing}>
              Back
            </Button>
            <Button
              color="red"
              onClick={handleConfirmSell}
              loading={isProcessing}
              disabled={isProcessing}
            >
              <Icon name="check" /> Confirm Sale
            </Button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default SellStockModal;
