import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returs a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).get(`/api/tickets/${id}`).send();
  expect(response.status).toEqual(404);
});

it('returs a 500 if the ticket id is invalid', async () => {
  const id = 'abcdef';
  const response = await request(app).get(`/api/tickets/${id}`).send();
  expect(response.status).toEqual(500);
});

it('it returns the ticket if the ticket is found', async () => {
  const cookie = global.signup('boldi@mail.hu');
  const title = 'Test ticket';

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price: 77,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get('/api/tickets/' + response.body.id)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
});
