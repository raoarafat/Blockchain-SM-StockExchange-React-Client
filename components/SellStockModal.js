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
import { blockchainService } from '../services/blockchainService';

const SellStockModal = ({ isOpen, onClose, company, exchangeAddress }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [blockchainError, setBlockchainError] = useState(null);

  const { sellStock, getStockPosition } = usePortfolio();
  const { user } = useAuth();

  // Update price when company changes
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

  const handleConfirmSell = async () => {
    setIsProcessing(true);
    setBlockchainError(null);

    try {
      // Debug: Log the price value and type
      console.log('Price before conversion:', price, typeof price);

      // Get the price from the company object if it's not available in the state
      let numericPrice;
      if (price && !isNaN(parseFloat(price))) {
        numericPrice = parseFloat(price);
      } else if (company && company.sellPrice) {
        numericPrice = parseFloat(company.sellPrice);
      } else {
        setBlockchainError('Invalid price value. Could not determine price.');
        setIsProcessing(false);
        return;
      }

      console.log('Price after conversion:', numericPrice, typeof numericPrice);

      // Make sure quantity is also a number
      const numericQuantity = parseInt(quantity, 10);
      if (isNaN(numericQuantity) || numericQuantity <= 0) {
        setBlockchainError('Invalid quantity value');
        setIsProcessing(false);
        return;
      }

      // First, try to execute the blockchain transaction to record the sale
      const blockchainResult = await blockchainService.recordSellTransaction(
        exchangeAddress,
        company.symbol,
        numericPrice,
        numericQuantity
      );

      if (!blockchainResult.success) {
        setBlockchainError(blockchainResult.error);
        setIsProcessing(false);
        return;
      }

      // If blockchain transaction succeeds, update the UI state
      const result = sellStock(company, numericQuantity, numericPrice);
      setResult(result);

      if (result.success) {
        // Close the modal after a short delay on success
        setTimeout(() => {
          resetAndClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error in handleConfirmSell:', error);
      setBlockchainError(error.message);
    } finally {
      setIsProcessing(false);
      setShowConfirmation(false);
    }
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
    setBlockchainError(null);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={resetAndClose} size="small" closeIcon>
      <Modal.Header>
        <Icon name="dollar" /> Sell {company.name} ({company.symbol}) Shares
      </Modal.Header>

      <Modal.Content>
        {blockchainError && (
          <Message negative>
            <Message.Header>Blockchain Transaction Failed</Message.Header>
            <p>{blockchainError}</p>
          </Message>
        )}

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
