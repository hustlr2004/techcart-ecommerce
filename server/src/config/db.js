const mongoose = require('mongoose');

let dbConnected = false;

/**
 * Connect to MongoDB using mongoose.
 * Reads MONGO_URI from environment if no uri is passed.
 * @param {string} [uri] MongoDB connection string
 */
async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('MongoDB URI is not set. Starting without database connection.');
    dbConnected = false;
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    dbConnected = true;
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    dbConnected = false;
    console.error('MongoDB connection error:', err);
    return false;
  }
}

function isDbConnected() {
  return dbConnected;
}

module.exports = { connectDB, isDbConnected };
