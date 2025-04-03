import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
  state = {
    loadingFinalize: false,
    loadingApproved: false,
  };

  onApprove = async () => {
    this.setState({ loadingApproved: true });

    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });

      console.log('Approved Request Done');
      Router.pushRoute(`/campaigns/detail/${this.props.address}`);
    } catch (err) {
      console.log('Approved Request Failed');
      this.setState({ errorMessage: err.message });
      console.log(err);
    } finally {
      this.setState({ loadingApproved: false });
    }
  };

  onFinalize = async () => {
    this.setState({ loadingFinalize: true });

    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      const balance = await web3.eth.getBalance(this.props.address);
      console.log('Contract Balance:', web3.utils.fromWei(balance, 'ether'));

      console.log(
        'Request Value (ETH):',
        web3.utils.fromWei(this.props.request.value.toString(), 'ether')
      );

      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      });

      console.log('Finalized Request Done');
      Router.pushRoute(`/campaigns/detail/${this.props.address}`);
    } catch (err) {
      console.log('Finalized Request Failed');
      console.log(err);
    } finally {
      this.setState({ loadingFinalize: false });
    }
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    const approvalCount = Number(request.approvalCount);

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>
          {request.value
            ? web3.utils.fromWei(request.value.toString(), 'ether')
            : 'N/A'}
        </Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingApproved}
              color="green"
              basic
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingFinalize}
              color="teal"
              basic
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
