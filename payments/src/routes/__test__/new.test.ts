import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose, { version } from 'mongoose';
import { OrderStatus } from '@bigticket/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a NotFoundError(404) when purchasing an order that does not exist.', async () => {
  const cookie1 = global.signup('boldi@mail.hu');
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie1)
    .send({
      token: 'abcdef',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a NotAuthorizedError(401) when purchasing an order that does not belong to the user.', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
  });

  await order.save();

  const cookie1 = global.signup('boldi@mail.hu');
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie1)
    .send({
      token: 'abcdef',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a BadRequestError(400) when purchasing a cancelled order.', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const cookie1 = global.signup('boldi@mail.hu', userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    userId: userId,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie1)
    .send({
      token: 'abcdef',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const cookie1 = global.signup('boldi@mail.hu', userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    userId: userId,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie1)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargedOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargedOptions.source).toEqual('tok_visa');
  expect(chargedOptions.amount).toEqual(order.price * 100);
  expect(chargedOptions.currency).toEqual('usd');
});
