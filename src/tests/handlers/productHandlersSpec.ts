import app from '../../server';
import supertest from 'supertest';
import { UserStore } from '../../models/user';
import {Client} from '../../database';

const request = supertest(app);

let token: string;

const store = new UserStore();

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

describe('Test endpoint /products: ', () => {
  beforeAll(async () => {
    await resetSequenceDB();

    //Create a user
    await store.create({
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password123',
    });

    const res = await request.post('/users/authenticate').send({
      username: 'username',
      password: 'password123',
    });

    token = res.body;
  });

  it('/products , method POST (create a new product)', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `token ${token}`)
      .send({
        name: 'Violin',
        price: 350,
        category: 'Music instruments',
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Violin');
  });

  it('/products , method GET (show all products)', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it('/products/:id , method GET (show a specific product)', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Violin');
  });

  it('/products/category/:category , method GET (show products by specific category)', async () => {
    const response = await request.get('/products/category/Music instruments');
    expect(response.status).toBe(200);
    expect(response.body[0].category).toEqual('Music instruments');
  });

  it('/products/:id , method PUT (update a product)', async () => {
    const response = await request
      .put('/products/1')
      .set('Authorization', `token ${token}`)
      .send({
        name: 'Violin',
        price: 400,
        category: 'Music instruments',
      });
    expect(response.status).toBe(200);
    expect(response.body.price).toEqual(400);
  });

  it('/products/:id , method DELETE (delete a product)', async () => {
    await request.delete('/products/1').set('Authorization', `token ${token}`);
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
  });

  afterAll(async () => {
    //Delete a user
    await store.delete('1');
  });
});
