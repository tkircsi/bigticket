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

it('fetches orders for an particular user', async () => {
  const cookieUser1 = global.signup('boldi@mail.hu');
  const cookieUser2 = global.signup('tibcsi@mail.hu');

  // Create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Create two order as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Get orders of User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookieUser2)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
