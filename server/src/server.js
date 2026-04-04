const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;
// Accept either MONGO_URI or MONGODB_URI from environment.
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI or MONGODB_URI is not set. Please add it to your .env file and restart.');
  process.exit(1);
}

async function start() {
  try {
    const dbReady = await connectDB(MONGO_URI);
    if (!dbReady) {
      console.warn('Starting server in degraded mode because MongoDB is unavailable.');
    }
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
