import request from 'supertest';
import { app } from '../../app';

it('it can fetch a list of tickets', async () => {
  const cookie = global.signup('boldi@mail.hu');
  const ticketList = [
    {
      title: 'Test Title 1',
      price: 20,
    },
    {
      title: 'Test Title 2',
      price: 100,
    },
    {
      title: 'Test Title 3',
      price: 255,
    },
  ];

  const ticketPromises = ticketList.map((ticket) => {
    return request(app).post('/api/tickets').set('Cookie', cookie).send(ticket);
  });

  const ticketResponses = await Promise.all(ticketPromises);
  ticketResponses.forEach((t) => {
    expect(t.status).toEqual(201);
  });

  const tickets = await request(app).get('/api/tickets');
  expect(tickets.status).toEqual(200);
  expect(tickets.body.length).toEqual(ticketList.length);
});
