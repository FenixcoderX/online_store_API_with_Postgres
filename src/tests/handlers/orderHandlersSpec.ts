import app from '../../server';
import supertest from 'supertest';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import {Client} from '../../database';

const request = supertest(app);

let token: string;

const store = new UserStore();
const store3 = new ProductStore();

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

describe('Test endpoint /orders: ', () => {
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

    //Create a product
    await store3.create({
      name: 'Violin',
      price: 350,
      category: 'Music instruments',
    });
  });

  it('/orders , method POST (create a new order)', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `token ${token}`)
      .send({
        user_id: 1,
        status: 'active',
      });
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('active');
  });

  it('/orders , method GET (show all orders)', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it('/orders/:id , method GET (show a specific order)', async () => {
    const response = await request
      .get('/orders/1')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(1);
  });

  it('/orders/current/:id , method GET (show current (active) order by specific user)', async () => {
    const response = await request
      .get('/orders/current/1')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('active');
  });

  it('/orders/:order_id/products , method POST (add a product to a specific order)', async () => {
    const response = await request
      .post('/orders/1/products')
      .set('Authorization', `token ${token}`)
      .send({
        order_id: 1,
        product_id: 1,
        quantity: 10,
      });
    expect(response.status).toBe(200);
    expect(response.body.product_id).toEqual(1);
  });

  it('/orders/:order_id/products , method DELETE (delete a product from a specific order)', async () => {
    const response = await request
      .delete('/orders/1/products')
      .set('Authorization', `token ${token}`)
      .send({
        product_id: 1,
      });
    expect(response.status).toBe(200);
    expect(response.body.product_id).toEqual(1);
  });

  it('/orders/:id , method PUT (update an order)', async () => {
    const response = await request
      .put('/orders/1')
      .set('Authorization', `token ${token}`)
      .send({
        user_id: 1,
        status: 'complete',
      });
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('complete');
  });

  it('/orders/completed/:id , method GET (show completed orders by specific user)', async () => {
    const response = await request
      .get('/orders/completed/1')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body[0].status).toEqual('complete');
  });

  it('/orders/:id , method DELETE (delete a order)', async () => {
    await request.delete('/orders/1').set('Authorization', `token ${token}`);
    const response = await request
      .get('/orders')
      .set('Authorization', `token ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
  });

  afterAll(async () => {
    //Delete a product
    await store3.delete('1');
    //Delete a user
    await store.delete('1');
  });
});
