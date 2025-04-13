import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import { pageStyles } from '../styles/global';

const Layout = ({ children, activeItem }) => {
  return (
    <div>
      <Header activeItem={activeItem} />
      <Container style={pageStyles.container}>{children}</Container>
    </div>
  );
};

export default Layout;
