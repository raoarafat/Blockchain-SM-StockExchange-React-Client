const { createServer } = require('http');
const next = require('next');

// Define the Next.js app setup
const app = next({
  dev: process.env.NODE_ENV !== 'production',
});
const routes = require('./routes'); // Assuming this is custom routing, adjust as needed
const handler = routes.getRequestHandler(app);

// Port setup (ensure it uses an environment variable or fallback)
const PORT = process.env.PORT || 3002;

app.prepare().then(() => {
  createServer(handler).listen(PORT, async (err) => {
    if (err) throw err;
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
