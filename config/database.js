import mongoose from 'mongoose';

/**
 * ConnectDB() is an async function that uses mongoose.connect() to connect to the MongoDB database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    );
    console.log('MongoDB Connected: ', conn.connection.host);
  } catch (error) {
    console.log('Database connection Error: ', error);
    process.exit(1);
  }
};

export default connectDB;
