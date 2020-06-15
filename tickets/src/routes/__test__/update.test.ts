import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signup('boldi@mail.hu');

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Test Title',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const cookieUser1 = global.signup('boldi@mail.hu');
  const cookieUser2 = global.signup('tibcsi@mail.hu');

  const res1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookieUser1)
    .send({
      title: 'Ticket Title',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res1.body.id}`)
    .set('Cookie', cookieUser2)
    .send({
      title: res1.body.title,
      price: 77,
    })
    .expect(401);
});

it('returns a 400 if the title or price is invalid', async () => {
  const cookie = global.signup('boldi@mail.hu');
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Ticket Title',
      price: -20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      price: -20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Ticket Title',
    })
    .expect(400);
});

it('updates the ticket with the provided valid inputs', async () => {
  const cookie = global.signup('boldi@mail.hu');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Ticket Title',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: response.body.title,
      price: 77,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.price).toEqual(77);
});

it('publishes an event ticket updated', async () => {
  const cookie = global.signup('boldi@mail.hu');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Ticket Title',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: response.body.title,
      price: 300,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects update if the ticket is reserved', async () => {
  const cookie = global.signup('boldi@mail.hu');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Ticket Title',
      price: 20,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: response.body.title,
      price: 77,
    })
    .expect(400);
});
