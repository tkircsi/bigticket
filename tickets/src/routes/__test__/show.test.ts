import request from 'supertest';
import { app } from '../../app';

it('returs a 404 if the ticket is not found', async () => {
  const response = await request(app).get('/api/tickets/abcdef123456').send();
  expect(response.status).toEqual(404);
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
