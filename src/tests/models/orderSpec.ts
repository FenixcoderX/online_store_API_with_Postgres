import { UserStore } from '../../models/user';
import { OrderStore, OrderWithProductsStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import {Client} from '../../database';

const store = new UserStore();
const store1 = new OrderStore();
const store2 = new OrderWithProductsStore();
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

describe('Order Model', () => {
  beforeAll(async () => {
    await resetSequenceDB();

    //Create a user
    await store.create({
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password123',
    });

    //Create a product
    await store3.create({
      name: 'Violin',
      price: 350,
      category: 'Music instruments',
    });
  });

  it('create method should add an order', async () => {
    const result = await store1.create({
      user_id: 1,
      status: 'active',
    });
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: 'active',
    });
  });

  it('index method should return a list of orders', async () => {
    const result = await store1.index();
    expect(result).toEqual([
      {
        id: 1,
        user_id: 1,
        status: 'active',
      },
    ]);
  });

  it('show method should return the correct order', async () => {
    const result = await store1.show('1');
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: 'active',
    });
  });

  it('currentOrder method should return a current (active) order by correct user', async () => {
    const result = await store1.currentOrder('1');
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: 'active',
    });
  });

  it('addProduct method should add product to the order', async () => {
    const result = await store2.addProduct(1, 1, 10);
    expect(result).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 10,
    });
  });

  it('deleteProduct method should remove product from the order', async () => {
    const result = await store2.deleteProduct(1, 1);
    expect(result).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 10,
    });
  });

  it('update method should update an order', async () => {
    const result = await store1.update({
      id: 1,
      user_id: 1,
      status: 'complete',
    });
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: 'complete',
    });
  });

  it('completedOrders method should return a list of completed orders by correct user', async () => {
    const result = await store1.completedOrders('1');
    expect(result).toEqual([
      {
        id: 1,
        user_id: 1,
        status: 'complete',
      },
    ]);
  });

  it('delete method should remove the order', async () => {
    await store1.delete('1');
    await store.delete('1'); //delete the user
    const result = await store1.index();
    expect(result).toEqual([]);
  });

  afterAll(async () => {
    //Delete a product
    await store3.delete('1');

    //Delete a user
    await store.delete('1');
  });
});
