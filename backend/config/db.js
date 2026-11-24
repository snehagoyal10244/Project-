import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn('⚠️  MONGODB_URI is not set in environment variables. Checking fallback...');
    }

    const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/novara_db', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`🌿 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.info('💡 Note: Set MONGODB_URI in backend/.env with your MongoDB Atlas connection string.');
    // Do not crash server in development if DB is temporarily unreachable
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🌿 MongoDB connection re-established.');
});

export default connectDB;
