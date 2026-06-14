import mongoose from 'mongoose';
import dns from 'dns';

// Override default DNS servers in Node.js to resolve SRV records on Windows/local environments reliably
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn('[Database] Warning: Could not set custom DNS servers:', error);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('[Database] CRITICAL: MONGODB_URI environment variable is missing from .env file.');
  process.exit(1);
}

/**
 * Connect to MongoDB and set up connection event listeners.
 */
export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.listeners('connected').length === 0) {
      mongoose.connection.on('connecting', () => {
        console.log('[Database] Attempting MongoDB connection...');
      });

      mongoose.connection.on('connected', () => {
        console.log('[Database] MongoDB connected successfully.');
      });

      mongoose.connection.on('error', (err) => {
        console.error(`[Database] MongoDB connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('[Database] MongoDB disconnected.');
      });
    }

    console.log('[Database] Attempting MongoDB connection...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error('[Database] MongoDB connection failed:', error);
    process.exit(1);
  }
};

/**
 * Gracefully close the MongoDB connection.
 */
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed gracefully.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};
