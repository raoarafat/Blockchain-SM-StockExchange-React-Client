import React, { Component } from 'react';
import Layout from '../../components/layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    campaignName: '',
    minimumContribution: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });
    try {
      // Create a new campaign
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.campaignName, this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <>
        <h1>Create a Campaign</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <Input
              value={this.state.campaignName}
              placeholder="Enter campaign name"
              onChange={(event) =>
                this.setState({ campaignName: event.target.value })
              }
              style={{ marginBottom: '10px' }} // Adds space
            />
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              placeholder="Enter minimum contribution"
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </>
    );
  }
}

export default CampaignNew; // Ensure the component is exported as default
