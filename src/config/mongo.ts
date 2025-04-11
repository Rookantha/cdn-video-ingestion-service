import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_NAME;

  if (!mongoUri || !dbName) {
    console.error('❌ MONGODB_URI or MONGODB_NAME not defined in .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log(`✅ MongoDB connected to database: ${dbName}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};
