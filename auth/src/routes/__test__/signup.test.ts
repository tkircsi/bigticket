import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail',
      password: '1234',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '12',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(400);
});

it('it sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
