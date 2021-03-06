import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('listening to /api/tickets post request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('can only be accessed if the user is signed in and returns 201', async () => {
  const cookie = global.signup('boldi@mail.hu');

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test title',
      price: 10,
    })
    .expect(201);
});

it('returns an error when invalid title is provided', async () => {
  const cookie = global.signup('boldi@mail.hu');

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
});

it('returns an error when invalid price is provided', async () => {
  const cookie = global.signup('boldi@mail.hu');

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
      price: 'a12',
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  const cookie = global.signup('boldi@mail.hu');

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it('publishes an event ticket created', async () => {
  const cookie = global.signup('boldi@mail.hu');

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Rolling Stone',
      price: 200,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
