import React, { useState, useEffect } from 'react';
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
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';

const SellStockModal = ({ isOpen, onClose, company }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const { sellStock, getStockPosition } = usePortfolio();
  const { user } = useAuth();

  // Update price when company changes - this hook must be called unconditionally
  useEffect(() => {
    if (company) {
      setPrice(company.sellPrice);
    }
  }, [company]);

  if (!company || !user) return null;

  const position = getStockPosition(company.symbol);
  const canSell = position && position.quantity >= quantity;
  const totalValue = quantity * price;

  const handleQuantityChange = (e, { value }) => {
    // Ensure quantity is a positive number
    const newQuantity = Math.max(1, parseInt(value) || 1);
    setQuantity(newQuantity);
  };

  const handlePriceChange = (e, { value }) => {
    // Ensure price is a positive number
    const newPrice = Math.max(0.01, parseFloat(value) || 0.01);
    setPrice(newPrice);
  };

  const handleSellClick = () => {
    if (!position) {
      setResult({
        success: false,
        message: `You don't own any shares of ${company.symbol}.`,
      });
      return;
    }

    if (!canSell) {
      setResult({
        success: false,
        message: `You only own ${position.quantity} shares of ${company.symbol}.`,
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSell = () => {
    setIsProcessing(true);

    // Process the sale
    setTimeout(() => {
      const result = sellStock(company, quantity, price);
      setResult(result);
      setIsProcessing(false);
      setShowConfirmation(false);

      if (result.success) {
        // Close the modal after a short delay on success
        setTimeout(() => {
          resetAndClose();
        }, 2000);
      }
    }, 1000);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const resetAndClose = () => {
    setQuantity(1);
    if (company) {
      setPrice(company.sellPrice);
    }
    setShowConfirmation(false);
    setIsProcessing(false);
    setResult(null);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={resetAndClose} size="small" closeIcon>
      <Modal.Header>
        <Icon name="dollar" /> Sell {company.name} ({company.symbol}) Shares
      </Modal.Header>

      <Modal.Content>
        {result ? (
          <Message
            positive={result.success}
            negative={!result.success}
            icon={result.success ? 'check circle' : 'exclamation triangle'}
            header={result.success ? 'Sale Successful' : 'Sale Failed'}
            content={result.message}
          />
        ) : !showConfirmation ? (
          <Segment>
            <Header as="h3">Stock Information</Header>
            <Statistic.Group size="small" widths="three">
              <Statistic color="red">
                <Statistic.Value>
                  {formatCurrency(company.sellPrice)}
                </Statistic.Value>
                <Statistic.Label>Market Price</Statistic.Label>
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

            {position ? (
              <>
                <Divider />
                <Header as="h4">Your Current Position</Header>
                <p>
                  You currently own {position.quantity} shares at an average
                  price of {formatCurrency(position.averagePrice)}
                </p>
                {position.averagePrice < price ? (
                  <Message positive>
                    <Icon name="arrow up" />
                    Potential profit:{' '}
                    {formatCurrency(
                      (price - position.averagePrice) * position.quantity
                    )}
                  </Message>
                ) : (
                  <Message negative>
                    <Icon name="arrow down" />
                    Potential loss:{' '}
                    {formatCurrency(
                      (position.averagePrice - price) * position.quantity
                    )}
                  </Message>
                )}
              </>
            ) : (
              <Message warning>
                You don't own any shares of {company.symbol}.
              </Message>
            )}

            <Divider />

            <Form>
              <Form.Group widths="equal">
                <Form.Field>
                  <label>Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    max={position ? position.quantity : 1}
                    value={quantity}
                    onChange={handleQuantityChange}
                    fluid
                    label={{ basic: true, content: 'shares' }}
                    labelPosition="right"
                    disabled={!position}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Price per Share</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={handlePriceChange}
                    fluid
                    label={{ basic: true, content: '$' }}
                    labelPosition="left"
                    disabled={!position}
                  />
                </Form.Field>
              </Form.Group>

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
                  <div>{formatCurrency(price)}</div>
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0',
                  }}
                >
                  <div>Your Balance:</div>
                  <div>{formatCurrency(user.fund)}</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '10px 0',
                  }}
                >
                  <div>New Balance:</div>
                  <div style={{ color: 'green' }}>
                    {formatCurrency(user.fund + totalValue)}
                  </div>
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
                {formatCurrency(price)} per share.
              </p>
              <p>Total value: {formatCurrency(totalValue)}</p>
              <p>
                Your balance after this sale will be{' '}
                {formatCurrency(user.fund + totalValue)}
              </p>
              <p>Do you want to proceed with this transaction?</p>
            </Message>
          </Segment>
        )}
      </Modal.Content>

      <Modal.Actions>
        {result ? (
          <Button color="grey" onClick={resetAndClose}>
            Close
          </Button>
        ) : !showConfirmation ? (
          <>
            <Button color="grey" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleSellClick}
              disabled={!position || position.quantity < quantity}
            >
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
