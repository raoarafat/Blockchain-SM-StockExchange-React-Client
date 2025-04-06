import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import StockExchange from '../ethereum/stockexchange';

class ContributeForm extends Component {
  state = {
    contribution: 0,
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    const campaign = StockExchange(this.props.address);

    try {
      // Create a new campaign
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contribution, 'ether'),
      });
      Router.replaceRoute(`/campaigns/detail/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }

    this.setState({ loading: false, contribution: 0 });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          {/* <Input label="ether" labelPosition="right" value={this.state.value} /> */}
          <Input
            label="wei"
            labelPosition="right"
            value={this.state.contribution}
            onChange={(event) =>
              this.setState({ contribution: event.target.value })
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button loading={this.state.loading} primary>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
