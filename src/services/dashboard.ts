// Define dashboard model: class and its methods to interact with the database

import { Client } from '../database';

/**
 * Class that interacts with the database to perform queries on the dashboard, contains following methods:
 * */
export class DashboardQueries {
  /**
   * Shows all products included in orders
   *
   * @returns {Promise<{ name: string; price: number; order_id: string; quantity: number }[]>} An array of objects containing the name, price, order_id, and quantity of each product.
   */
  async productsInOrders(): Promise<
    {
      name: string;
      price: number;
      order_id: string;
      quantity: number;
    }[]
  > {
    try {
      // INNER JOIN to combine rows from two tables (products and order_products). ON to specify the condition for the join: id in products table matches product_id in order_products table
      const sql = 'SELECT name, price, order_id, quantity FROM products INNER JOIN order_products ON products.id = order_products.product_id';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get all products included in orders. Error: ${err}`);
    }
  }

  /**
   * Shows all users who have made orders
   *
   * @returns {Promise<{ username: string }[]>} An array of objects containing the username of each user who has made an order
   */
  async usersWithOrders(): Promise<{ username: string }[]> {
    try {
      // INNER JOIN to combine rows from two tables (users and orders). ON to specify the condition for the join: id in users table matches user_id in orders table
      const sql = 'SELECT username FROM users INNER JOIN orders ON users.id = orders.user_id';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users who have made orders. Error: ${err}`);
    }
  }

  /**
   * Show 5 most expensive products
   *
   * @returns {Promise<{ name: string; price: number }[]>} An array of objects containing the name and price of each of the 5 most expensive products
   */
  async fiveMostExpensive(): Promise<{ name: string; price: number }[]> {
    try {
      //ORDER BY to sort the result set in descending order of price, LIMIT to limit the number of rows returned to 5
      const sql = 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get 5 most expensive products. Error: ${err}`);
    }
  }

  /**
   * Show 5 most popular products
   *
   * @returns {Promise<{ id: string; name: string; price: number; category: string; quantity: number }[]>} An array of objects containing the id, name, price, category, and quantity of each of the 5 most popular products
   */
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
      // SUM is used with GROUP BY to calculate the total quantity of each group of products with the same id, name, price, and category and return the result as a single row
      // AS is used to rename the column as total_quantity 
      const sql = `
        SELECT p.id, p.name, p.price, p.category, SUM(o.quantity) AS total_quantity
        FROM products p JOIN order_products o ON p.id = o.product_id 
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
