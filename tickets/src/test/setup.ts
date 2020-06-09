import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

declare global {
  namespace NodeJS {
    interface Global {
      signup(email: string): string;
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = (email: string) => {
  // Create a JWT with payload { id, email }
  const userJwt = jwt.sign(
    {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: email,
    },
    process.env.JWT_KEY!
  );
  const cookie = Buffer.from(JSON.stringify({ jwt: userJwt })).toString(
    'base64'
  );

  return 'express:sess=' + cookie;
};
