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

const BuyStockModal = ({ isOpen, onClose, company, exchangeAddress }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [blockchainError, setBlockchainError] = useState(null);

  const { buyStock, getStockPosition } = usePortfolio();
  const { user } = useAuth();

  // Update price when company changes
  useEffect(() => {
    if (company) {
      setPrice(company.buyPrice);
    }
  }, [company]);

  if (!company || !user) return null;

  const totalCost = quantity * price;
  const canAfford = user.fund >= totalCost;
  const currentPosition = getStockPosition(company.symbol);

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

  const handleBuyClick = () => {
    if (!canAfford) {
      setResult({
        success: false,
        message: `Insufficient funds. You need ${formatCurrency(
          totalCost - user.fund
        )} more.`,
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmBuy = async () => {
    setIsProcessing(true);
    setBlockchainError(null);

    try {
      // First, try to execute the blockchain transaction
      const blockchainResult = await blockchainService.buyStock(
        exchangeAddress,
        company.symbol,
        quantity
      );

      if (!blockchainResult.success) {
        setBlockchainError(blockchainResult.error);
        setIsProcessing(false);
        return;
      }

      // If blockchain transaction succeeds, update the UI state
      const result = buyStock(company, quantity, price);
      setResult(result);

      if (result.success) {
        // Close the modal after a short delay on success
        setTimeout(() => {
          resetAndClose();
        }, 2000);
      }
    } catch (error) {
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
      setPrice(company.buyPrice);
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
        <Icon name="shopping cart" /> Buy {company.name} ({company.symbol})
        Shares
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
            header={result.success ? 'Purchase Successful' : 'Purchase Failed'}
            content={result.message}
          />
        ) : !showConfirmation ? (
          <Segment>
            <Header as="h3">Stock Information</Header>
            <Statistic.Group size="small" widths="three">
              <Statistic color="green">
                <Statistic.Value>
                  {formatCurrency(company.buyPrice)}
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

            {currentPosition && (
              <>
                <Divider />
                <Header as="h4">Your Current Position</Header>
                <p>
                  You currently own {currentPosition.quantity} shares at an
                  average price of{' '}
                  {formatCurrency(currentPosition.averagePrice)}
                </p>
              </>
            )}

            <Divider />

            <Form>
              <Form.Group widths="equal">
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
                  <div>Total Cost:</div>
                  <div>{formatCurrency(totalCost)}</div>
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
                  <div>Remaining Balance:</div>
                  <div style={{ color: canAfford ? 'green' : 'red' }}>
                    {formatCurrency(user.fund - totalCost)}
                  </div>
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
                at {formatCurrency(price)} per share.
              </p>
              <p>Total cost: {formatCurrency(totalCost)}</p>
              <p>
                Your balance after this purchase will be{' '}
                {formatCurrency(user.fund - totalCost)}
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
              color="green"
              onClick={handleBuyClick}
              disabled={!canAfford}
            >
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
