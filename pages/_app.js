import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import 'semantic-ui-css/semantic.min.css'; // Import Semantic UI CSS globally

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
