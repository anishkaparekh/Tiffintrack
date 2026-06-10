import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tiffintrack';

/**
 * Connect to MongoDB and set up connection event listeners.
 */
export const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected.');
    });

    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
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
