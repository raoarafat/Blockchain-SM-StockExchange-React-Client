import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PortfolioProvider } from '../context/PortfolioContext';
import 'semantic-ui-css/semantic.min.css'; // Import Semantic UI CSS globally

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Component {...pageProps} />
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default MyApp;
