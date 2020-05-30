import request from 'supertest';
import { app } from '../../app';

it('successful signout and clears the cookie', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();

  const respOut = await request(app).get('/api/users/signout').expect(200);

  expect(respOut.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
