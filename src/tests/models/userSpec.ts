import { UserStore } from '../../models/user';

import {Client} from '../../database';

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

describe('User Model', () => {
  beforeAll(async () => {
    await resetSequenceDB();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password123',
    });
    expect(result.username).toEqual('username');
  });

  it('authenticate method should return a correct user', async () => {
    const result = await store.authenticate('username', 'password123');
    expect(result?.username).toEqual('username');
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result[0].username).toEqual('username');
  });

  it('show method should return the correct user', async () => {
    const result = await store.show('1');
    expect(result.username).toEqual('username');
  });

  it('update method should update a user', async () => {
    const result = await store.update({
      id: 1,
      username: 'username123',
      firstName: 'firstName123',
      lastName: 'lastName123',
      password: 'password123',
    });
    expect(result.username).toEqual('username123');
  });

  it('delete method should remove the user', async () => {
    await store.delete('1');
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
