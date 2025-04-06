import React, { Component } from 'react';
import Layout from '../../../components/layout';
import Link from 'next/link';
import StockExchange from '../../../ethereum/stockexchange';
import { Button, Table } from 'semantic-ui-react';
import RequestRow from '../../../components/RequestRow';

class RequestLists extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    const campaign = StockExchange(address);
    const requestCount = Number(
      await campaign.methods.getRequestsCount().call()
    );
    const approversCount = Number(
      await campaign.methods.approversCount().call()
    );

    const requests = await Promise.all(
      Array(requestCount)
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, requestCount, approversCount };
  }

  renderRows() {
    if (!this.props.requests || this.props.requests.length === 0) {
      return null; // Or you could return a placeholder or message if no requests are found
    }

    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        {this.props && this.props.address && (
          <Link href={`/campaigns/${this.props.address}/requests/new`}>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Request
            </Button>
          </Link>
        )}
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestLists;
