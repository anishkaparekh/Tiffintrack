import mongoose from 'mongoose';
import dns from 'dns';

// Override default DNS servers in Node.js to resolve SRV records on Windows/local environments reliably
try {
  dns.setDefaultResultOrder('ipv4first');
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
export const connectDB = async (): Promise<void> => {
  try {
    // Prevent multiple connection listeners being attached if connectDB is called again
    if (mongoose.connection.listeners('connected').length === 0) {
      mongoose.connection.on('connecting', () => {
        console.log('[MongoDB] Attempting to connect to MongoDB Atlas...');
      });

      mongoose.connection.on('connected', () => {
        console.log('[MongoDB] Successfully connected to MongoDB Atlas.');
      });

      mongoose.connection.on('error', (err: any) => {
        console.error(`[MongoDB] Connection error: ${err.message || err}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('[MongoDB] Disconnected from MongoDB Atlas.');
      });
    }

    // Connect to database
    await mongoose.connect(MONGODB_URI);
  } catch (error: any) {
    console.error('[MongoDB] Failed to connect to MongoDB Atlas:', error.message || error);
    process.exit(1);
  }
};

/**
 * Gracefully close the MongoDB connection.
 */
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed gracefully.');
  } catch (error) {
    console.error('[MongoDB] Error while closing connection:', error);
  }
};
