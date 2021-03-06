import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@bigticket/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 10,
  });
  await ticket.save();
  return ticket;
};

it('marks an order as cancelled', async () => {
  const cookieUser1 = global.signup('boldi@mail.hu');
  const ticket1 = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookieUser1)
    .send()
    .expect(204);

  const { body: cancelledOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookieUser1)
    .expect(200);

  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const cookieUser1 = global.signup('boldi@mail.hu');
  const ticket1 = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookieUser1)
    .send()
    .expect(204);

  const { body: cancelledOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookieUser1)
    .expect(200);

  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
