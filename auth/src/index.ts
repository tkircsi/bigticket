import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Connecting to auth-mongo-srv successfully...`);
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('Auth service is listening on port 3000');
  });
};

start();
