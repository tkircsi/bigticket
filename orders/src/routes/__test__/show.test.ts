import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
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

it('fetches the order', async () => {
  const cookieUser1 = global.signup('boldi@mail.hu');

  const ticket1 = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookieUser1)
    .expect(200);

  expect(order.id).toEqual(fetchedOrder.id);
});

it('returns a NotFoundError if the order does not exist', async () => {
  const cookieUser1 = global.signup('boldi@mail.hu');

  await request(app)
    .get(`/api/orders/${mongoose.Types.ObjectId()}`)
    .set('Cookie', cookieUser1)
    .expect(404);
});

it('returns a NotAuthorizedError if the user does not own the order', async () => {
  const cookieUser1 = global.signup('boldi@mail.hu');
  const cookieUser2 = global.signup('tibcsi@mail.hu');

  const ticket1 = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookieUser2)
    .expect(401);
});
