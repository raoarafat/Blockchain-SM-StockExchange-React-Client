import React from 'react';
import 'semantic-ui-css/semantic.min.css'; // Import Semantic UI CSS globally

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
