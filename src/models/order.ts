// Define order model: types, classes and its methods to interact with the database

import { Client } from '../database';

// Define properties of order types to be used in the OrderStore class

export type Order = {
  user_id: number;
  status: string;
};
export type OrderWithID = Order & {
  // extends Order
  id: number;
};

export type OrderWithProductsNoQuantity = {
  order_id: number;
  product_id: number;
};
export type OrderWithProducts = OrderWithProductsNoQuantity & {
  // extends OrderWithProductsNoQuantity
  quantity: number;
};
export type OrderWithProductsAndID = OrderWithProducts & {
  // extends OrderWithProducts
  id: number;
};

/**
 * Class that interacts with the database to perform CRUD operations on orders, contains following methods:
 */
export class OrderStore {
  /**
   * Shows all orders from the orders table of the database
   *
   * @returns {Promise<OrderWithID[]>} An array of order objects
   */
  async index(): Promise<OrderWithID[]> {
    try {
      const sql = 'SELECT * FROM orders';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  /**
   * Shows a specific order from the orders table of the database
   *
   * @param {string} id - The ID of the order to show
   * @returns {Promise<OrderWithID>} The order object with the provided ID
   */
  async show(id: string): Promise<OrderWithID> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get order by ${id}. Error: ${err}`);
    }
  }

  /**
   * Shows current (active) order by specific user ID in the orders table of the database
   *
   * @param {string} user_id - The user ID to show the current order
   * @returns {Promise<OrderWithID>} The current (active) order object with the provided user ID
   */
  async currentOrder(user_id: string): Promise<OrderWithID> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [user_id, 'active']);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get current (active) order by user ${user_id}. Error: ${err}`);
    }
  }

  /**
   * Shows completed orders by specific user ID in the orders table of the database
   *
   * @param {string} user_id - The user ID to show the completed orders
   * @returns {Promise<OrderWithID[]>} An array of completed order objects with the provided user ID
   */
  async completedOrders(user_id: string): Promise<OrderWithID[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const result = await conn.query(sql, [user_id, 'complete']);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get completed orders by user ${user_id}. Error: ${err}`);
    }
  }

  /**
   * Creates a new order in the orders table of the database
   *
   * @param {Order} o - The order object to create
   * @returns {Promise<OrderWithID>} The created order object
   */
  async create(o: Order): Promise<OrderWithID> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      // Check if there is a current (active) order for the user before creating a new order
      if ((await this.currentOrder(JSON.stringify(o.user_id))) === undefined) {
        const result = await conn.query(sql, [o.user_id, o.status]);
        const order = result.rows[0];
        conn.release();
        return order;
      }
      // If there is a current (active) order for the user, throw an error
      else {
        throw new Error(`Active order for this user is already exists`);
      }
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  /**
   * Updates an order in the orders table of the database by its ID
   *
   * @param {OrderWithID} o - The order object to update
   * @returns {Promise<OrderWithID>} The updated order object
   */
  async update(o: OrderWithID): Promise<OrderWithID> {
    try {
      const sql = 'UPDATE orders SET user_id=$2, status=$3 WHERE id=$1 RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [o.id, o.user_id, o.status]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not update order ${o.id}. Error: ${err}`);
    }
  }

  /**
   * Deletes an order from the orders table of the database by its ID
   *
   * @param {string} id - The ID of the order to delete
   * @returns {Promise<OrderWithID>} The deleted order object
   */
  async delete(id: string): Promise<OrderWithID> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }
}

/**
 * Class that interacts with the database to perform CRUD operations on orders with products, contains following methods:
 */
export class OrderWithProductsStore {
  /**
   * Adds a product to a specific order in the order_products table of the database
   *
   * @param {number} order_id - The ID of the order to add a product
   * @param {number} product_id - The ID of the product to add
   * @param {number} quantity - The quantity of the product to add
   * @returns {Promise<OrderWithProductsAndID>} The order object with the added product
   */
  async addProduct(order_id: number, product_id: number, quantity: number): Promise<OrderWithProductsAndID> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [order_id]);
      const order = result.rows[0];
      // Check if the order status is not active before adding a product and throw an error message 
      if (order.status !== 'active') {
        throw new Error(`Order ${order_id} status is "${order.status}".`);
      }
      conn.release();
    } catch (err) {
      throw new Error(`Could not add a product to an order. Error: ${err}`);
    }

    try {
      // Insert a new product to the order_products table when the order status is active
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [Number(order_id), Number(product_id), Number(quantity)]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add product ${product_id} to order ${order_id}. Error: ${err}`);
    }
  }

  /**
   * Deletes a product from a specific order in the order_products table of the database
   *
   * @param {number} order_id - The ID of the order to delete a product
   * @param {number} product_id - The ID of the product to delete
   * @returns {Promise<OrderWithProductsAndID>} The order object with the deleted product
   */
  async deleteProduct(order_id: number, product_id: number): Promise<OrderWithProductsAndID> {
    try {
      // INNER JOIN to combine rows from two tables (orders and order_products). ON to specify the condition for the join: id in orders table matches order_id in order_products table
      const sql = 'SELECT * FROM orders INNER JOIN order_products ON orders.id = order_products.order_id'; 
      const conn = await Client.connect();
      const result = await conn.query(sql);
      const order = result.rows[0];
      // Check if the order status is not active before deleting a product and throw an error message
      if (order.status !== 'active') {
        throw new Error(`Order ${order_id} status is "${order.status}".`);
      }
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete a product from an order. Error: ${err}`);
    }

    try {
      // Delete a product from the order_products table when the order status is active
      const sql = 'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [order_id, product_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete product ${product_id} from order ${order_id}. Error: ${err}`);
    }
  }
}
