import React from 'react';
import { Menu, Container, Icon, Dropdown } from 'semantic-ui-react';
import { Link } from '../routes';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

const Header = ({ activeItem }) => {
  const { user, logout } = useAuth();

  return (
    <Menu inverted style={{ backgroundColor: '#00b5ad', marginBottom: 0 }}>
      <Container>
        <Menu.Item header>
          <Icon name="chart line" />
          Stock Exchange
        </Menu.Item>

        <Menu.Item as={Link} route="/" active={activeItem === 'market'}>
          <Icon name="exchange" />
          Market
        </Menu.Item>

        <Menu.Item
          as={Link}
          route="/portfolio"
          active={activeItem === 'portfolio'}
        >
          <Icon name="briefcase" />
          Portfolio
        </Menu.Item>

        <Menu.Menu position="right">
          {user && (
            <Dropdown item text={`Welcome, ${user.name}`}>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Icon name="money" />
                  Balance: {formatCurrency(user?.fund)}
                </Dropdown.Item>
                <Dropdown.Item onClick={logout}>
                  <Icon name="sign out" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default Header;
