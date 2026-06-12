const mongoose = require('mongoose');
const dns = require('dns');

// Override default DNS servers in Node.js to resolve SRV records on Windows/local environments reliably
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn('[MongoDB] Warning: Could not set custom DNS servers:', error);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI environment variable is missing from .env file.');
  process.exit(1);
}

/**
 * Establish connection to MongoDB Atlas and configure event listeners.
 */
const connectDB = async () => {
  try {
    if (mongoose.connection.listeners('connected').length === 0) {
      mongoose.connection.on('connecting', () => {
        console.log('[MongoDB] Attempting to connect to MongoDB Atlas...');
      });

      mongoose.connection.on('connected', () => {
        console.log('[MongoDB] Successfully connected to MongoDB Atlas.');
      });

      mongoose.connection.on('error', (err) => {
        console.error(`[MongoDB] Connection error: ${err.message || err}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('[MongoDB] Disconnected from MongoDB Atlas.');
      });
    }

    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('[MongoDB] Failed to connect to MongoDB Atlas:', error.message || error);
    process.exit(1);
  }
};

/**
 * Gracefully close the MongoDB connection.
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed gracefully.');
  } catch (error) {
    console.error('[MongoDB] Error while closing connection:', error);
  }
};

module.exports = {
  connectDB,
  closeDB
};
