import { ProductStore } from '../../models/product';
import {Client} from '../../database';

const store = new ProductStore();

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

describe('Product Model', () => {
  beforeAll(async () => {
    await resetSequenceDB();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Violin',
      price: 350,
      category: 'Music instruments',
    });
    expect(result).toEqual({
      id: 1,
      name: 'Violin',
      price: 350,
      category: 'Music instruments',
    });
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: 'Violin',
        price: 350,
        category: 'Music instruments',
      },
    ]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      name: 'Violin',
      price: 350,
      category: 'Music instruments',
    });
  });

  it('indexByCategory method should return a list of products by correct category', async () => {
    const result = await store.indexByCategory('Music instruments');
    expect(result).toEqual([
      {
        id: 1,
        name: 'Violin',
        price: 350,
        category: 'Music instruments',
      },
    ]);
  });

  it('update method should update a product', async () => {
    const result = await store.update({
      id: 1,
      name: 'Violin',
      price: 450,
      category: 'Music instruments',
    });
    expect(result).toEqual({
      id: 1,
      name: 'Violin',
      price: 450,
      category: 'Music instruments',
    });
  });

  it('delete method should remove the product', async () => {
    await store.delete('1');
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
