import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('listening to /api/orders post request', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).toEqual(401);
});

it('returns an error if the ticket does not exist', async () => {
  const cookie = global.signup('boldi@mail.hu');
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const cookie = global.signup('boldi@mail.hu');
  const ticket = Ticket.build({
    title: 'Mozart Concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'abcd',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const cookie = global.signup('boldi@mail.hu');
  const ticket = Ticket.build({
    title: 'Mozart Concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const cookie = global.signup('boldi@mail.hu');
  const ticket = Ticket.build({
    title: 'Mozart Concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
