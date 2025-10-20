import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri!);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
