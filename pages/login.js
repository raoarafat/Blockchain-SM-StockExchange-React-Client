import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Grid,
  Header,
  Segment,
  Message,
  Icon,
} from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';
import Router from 'next/router';
import 'semantic-ui-css/semantic.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      Router.push('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const success = login(email, password);

    if (success) {
      // Redirect will happen automatically due to the useEffect above
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="chart line" /> Log in to your Investor Account
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              color="teal"
              fluid
              size="large"
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>
          </Segment>
        </Form>

        {error && (
          <Message negative>
            <Message.Header>Login Failed</Message.Header>
            <p>{error}</p>
          </Message>
        )}

        <Message>
          <p>Demo accounts:</p>
          <Message.List>
            <Message.Item>
              Email: john@example.com / Password: password123
            </Message.Item>
            <Message.Item>
              Email: sarah@example.com / Password: password123
            </Message.Item>
          </Message.List>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
