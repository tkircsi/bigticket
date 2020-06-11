import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@bigticket/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../models/order';
import { Ticket } from '../models/ticket';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS =
  Number(process.env.EXPIRATION_WINDOW_SECONDS) || 15 * 60;

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
    const { ticketId } = req.body;

    // Find the ticket created earlier via event
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Check the Ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved.');
    }

    // Calculate an expiration date of this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();
    // Publish an order created event

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
