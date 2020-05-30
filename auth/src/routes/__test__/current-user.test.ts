import request from 'supertest';
import { app } from '../../app';
import { body } from 'express-validator';
import { signupRouter } from '../signup';

it('test current user after successful signup', async () => {
  const email = 'boldi@mail.hu';
  const cookie = await global.signup(email);

  const respCurrentUser = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  expect(respCurrentUser.body.currentUser.email).toEqual(email);
});

it('test current user for not authenticated users', async () => {
  const respCurrentUser = await request(app)
    .get('/api/users/currentuser')
    .expect(200);

  expect(respCurrentUser.body.currentUser).toEqual(null);
});
