import { UserStore } from '../../models/user';
import { OrderStore, OrderWithProductsStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import { DashboardQueries } from '../../services/dashboard';
import {Client} from '../../database';

const store = new UserStore();
const store1 = new OrderStore();
const store2 = new OrderWithProductsStore();
const store3 = new ProductStore();
const store4 = new DashboardQueries();

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

describe('Test Dashboard functions', () => {
  beforeAll(async () => {
    await resetSequenceDB();

    //Create products
    for (let i = 1; i <= 7; i++) {
      await store3.create({
        name: `A${i}`,
        price: 350,
        category: 'Music instruments',
      });
    }
    const products = await store3.index();
    console.log('products', products);

    //Create users
    for (let i = 1; i <= 5; i++) {
      await store.create({
        username: `u${i}`,
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password123',
      });
    }
    const users = await store.index();
    console.log('USERS', users);

    //Create orders
    for (let i = 1; i <= 5; i++) {
      await store1.create({
        user_id: i,
        status: 'active',
      });
    }
    const orders = await store1.index();
    console.log('ORDERS', orders);

    //Create products in orders
    const p1 = await store2.addProduct(1, 1, 10);
    console.log(p1);
    const p2 = await store2.addProduct(1, 2, 20);
    console.log(p2);
    const p3 = await store2.addProduct(1, 3, 2);
    console.log(p3);
    const p4 = await store2.addProduct(1, 4, 15);
    console.log(p4);
    const p5 = await store2.addProduct(2, 1, 10);
    console.log(p5);
    const p6 = await store2.addProduct(2, 5, 20);
    console.log(p6);
    const p7 = await store2.addProduct(2, 6, 2);
    console.log(p7);
    const p8 = await store2.addProduct(2, 7, 15);
    console.log(p8);
    const p9 = await store2.addProduct(3, 3, 26);
    console.log(p9);
    const p10 = await store2.addProduct(3, 5, 4);
    console.log(p10);
    const p11 = await store2.addProduct(3, 1, 56);
    console.log(p11);
    const p12 = await store2.addProduct(4, 6, 2);
    console.log(p12);
    const p13 = await store2.addProduct(4, 7, 15);
    console.log(p13);
    const p14 = await store2.addProduct(4, 3, 15);
    console.log(p14);
    const p15 = await store2.addProduct(4, 1, 2);
    console.log(p15);
    const p16 = await store2.addProduct(4, 2, 10);
    console.log(p16);
    const p17 = await store2.addProduct(5, 4, 40);
    console.log(p17);
    const p18 = await store2.addProduct(5, 2, 40);
    console.log(p18);
  });
  //

  it('show 5 most popular products', async () => {
    const result = await store4.fiveMostPopular();
    console.log(result);
    expect(result).toEqual([
      // @ts-ignore
      { id: 1, name: 'A1', price: 350, category: 'Music instruments', total_quantity: '78' },
      // @ts-ignore
      { id: 2, name: 'A2', price: 350, category: 'Music instruments', total_quantity: '70' },
      // @ts-ignore
      { id: 4, name: 'A4', price: 350, category: 'Music instruments', total_quantity: '55' },
      // @ts-ignore
      { id: 3, name: 'A3', price: 350, category: 'Music instruments', total_quantity: '43' },
      // @ts-ignore
      { id: 7, name: 'A7', price: 350, category: 'Music instruments', total_quantity: '30' },
    ]);
  });

  afterAll(async () => {
    //Delete products in orders
    await store2.deleteProduct(1, 1);
    await store2.deleteProduct(1, 2);
    await store2.deleteProduct(1, 3);
    await store2.deleteProduct(1, 4);
    await store2.deleteProduct(2, 1);
    await store2.deleteProduct(2, 5);
    await store2.deleteProduct(2, 6);
    await store2.deleteProduct(2, 7);
    await store2.deleteProduct(3, 3);
    await store2.deleteProduct(3, 5);
    await store2.deleteProduct(3, 1);
    await store2.deleteProduct(4, 6);
    await store2.deleteProduct(4, 7);
    await store2.deleteProduct(4, 3);
    await store2.deleteProduct(4, 1);
    await store2.deleteProduct(4, 2);
    await store2.deleteProduct(5, 4);
    await store2.deleteProduct(5, 2);

    //Delete orders
    for (let i = 1; i <= 5; i++) {
      await store1.delete(`${i}`);
    }
    //Delete users
    for (let i = 1; i <= 5; i++) {
      await store.delete(`${i}`);
    }

    //Delete products
    for (let i = 1; i <= 7; i++) {
      await store3.delete(`${i}`);
    }
  });
});
