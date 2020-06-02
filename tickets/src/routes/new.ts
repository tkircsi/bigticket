import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@bigticket/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
  console.log(req.currentUser);
  res.status(201).send({});
});

export { router as createTicketRouter };
