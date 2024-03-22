import app from '../../server';
import supertest from 'supertest';

import {Client} from '../../database';

const request = supertest(app);

let token: string;

const resetSequenceDB = async (): Promise<void> => {
  try {
    const sql =
      'ALTER SEQUENCE "users_id_seq" RESTART WITH 1;' +
      'ALTER SEQUENCE "order_products_id_seq" RESTART WITH 1;ALTER SEQUENCE "orders_id_seq" RESTART WITH 1;' +
      'ALTER SEQUENCE "products_id_seq" RESTART WITH 1';

    const conn = await Client.connect();
    await conn.query(sql);
    conn.release();
  } catch (err) {
    throw new Error(`Could not reset id sequence in database. Error: ${err}`);
  }
};

describe('Test endpoint /users: ', () => {
  beforeAll(async () => {
    await resetSequenceDB();
  });

  it('/users , method POST (create a new user)', async () => {
    const response = await request.post('/users').send({
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password123',
    });
    expect(response.status).toBe(200);
    expect(response.body.length).toBeTrue;
  });

  it('/users/authenticate , method POST (authenticate a user)', async () => {
    const response = await request.post('/users/authenticate').send({
      username: 'username',
      password: 'password123',
    });
    token = response.body;
    expect(response.status).toBe(200);
    expect(response.body.length).toBeTrue;
  });

  it('/users , method GET (show all users)', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it('/users/:id , method GET (show a specific user)', async () => {
    const response = await request
      .get('/users/1')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('username');
  });

  it('/users/:id , method PUT (update a user)', async () => {
    const response = await request
      .put('/users/1')
      .set('Authorization', `token ${token}`)
      .send({
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName123',
        password: 'password123',
      });
    expect(response.status).toBe(200);
    expect(response.body.lastName).toEqual('lastName123');
  });

  it('/users/:id , method DELETE (delete a user)', async () => {
    await request.delete('/users/1').set('Authorization', `token ${token}`);
    const response = await request
      .get('/users')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
  });
});
