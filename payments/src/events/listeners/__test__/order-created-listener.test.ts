import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@bigticket/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'aaaa',
    status: OrderStatus.Created,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves an order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
