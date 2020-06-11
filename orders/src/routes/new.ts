import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@bigticket/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      // if Ticket service is mongodb
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
