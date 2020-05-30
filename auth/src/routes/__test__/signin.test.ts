import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'notexist@mail.hu',
      password: '1234',
    })
    .expect(400);
});

it('fails when bad password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'boldi@mail.hu',
      password: '12',
    })
    .expect(400);
});

it('successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'boldi@mail.hu',
      password: '1234',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
