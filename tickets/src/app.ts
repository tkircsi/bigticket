import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@bigticket/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.get('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
