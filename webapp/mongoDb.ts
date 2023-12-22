// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://omama:omama2072@cluster0.euovgbg.mongodb.net/shinesbudget';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, options);
      console.log('Connected to MongoDB');
    } else {
      console.log('Already connected to MongoDB');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default dbConnect;
