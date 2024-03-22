import {Client} from '../database';

export class DashboardQueries {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<
    { name: string; price: number; order_id: string; quantity: number }[]
  > {
    try {
      const sql =
        'SELECT name, price, order_id, quantity FROM products INNER JOIN order_products ON products.id = order_products.product_id';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get all products included in orders. Error: ${err}`,
      );
    }
  }

  // Get all users that have made orders
  async usersWithOrders(): Promise<{ username: string }[]> {
    try {
      const sql =
        'SELECT username FROM users INNER JOIN orders ON users.id = orders.user_id';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get users who have made orders. Error: ${err}`,
      );
    }
  }

  // Get 5 most expensive products
  async fiveMostExpensive(): Promise<{ name: string; price: number }[]> {
    try {
      const sql =
        'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get 5 most expensive products. Error: ${err}`);
    }
  }

  // Get 5 most popular products
  async fiveMostPopular(): Promise<
    {
      id: string;
      name: string;
      price: number;
      category: string;
      quantity: number;
    }[]
  > {
    try {
      const sql = `
        SELECT p.id, p.name, p.price, p.category, SUM(o.quantity) AS total_quantity
        FROM products p
        JOIN order_products o ON p.id = o.product_id
        GROUP BY p.id
        ORDER BY total_quantity DESC
        LIMIT 5
      `;
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get 5 most popular products. Error: ${err}`);
    }
  }
}
