import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@bigticket/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  let ticket = null;
  try {
    ticket = await Ticket.findById(req.params.id);
  } catch (err) {
    throw new BadRequestError(err.message);
  }

  if (!ticket) {
    throw new NotFoundError();
  } else {
    res.status(200).send(ticket);
  }
});

export { router as showTicketRouter };
