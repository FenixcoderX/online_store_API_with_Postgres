import {Client} from '../database';

export type Order = {
  user_id: number;
  status: string;
};

export type OrderWithID = Order & {
  id: number;
};

export type OrderWithProductsNoQuantity = {
  order_id: number;
  product_id: number;
};
export type OrderWithProducts = OrderWithProductsNoQuantity & {
  quantity: number;
};

export type OrderWithProductsAndID = OrderWithProducts & {
  id: number;
};

export class OrderStore {
  async index(): Promise<OrderWithID[]> {
    try {
      const sql = 'SELECT * FROM orders';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      //console.log (result.rows);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

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

  async currentOrder(user_id: string): Promise<OrderWithID> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [user_id, 'active']);
      conn.release();
      //console.log (result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not get current (active) order by user ${user_id}. Error: ${err}`,
      );
    }
  }

  async completedOrders(user_id: string): Promise<OrderWithID[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const result = await conn.query(sql, [user_id, 'complete']);
      conn.release();
      //console.log (result.rows );
      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get completed orders by user ${user_id}. Error: ${err}`,
      );
    }
  }

  async create(o: Order): Promise<OrderWithID> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      if ((await this.currentOrder(JSON.stringify(o.user_id))) === undefined) {
        const result = await conn.query(sql, [o.user_id, o.status]);
        const order = result.rows[0];
        console.log('Return from the database after creating an order', order);
        conn.release();
        return order;
      } else {
        throw new Error(`Active order for this user is already exists`);
      }
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async update(o: OrderWithID): Promise<OrderWithID> {
    try {
      const sql =
        'UPDATE orders SET user_id=$2, status=$3 WHERE id=$1 RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [o.id, o.user_id, o.status]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not update order ${o.id}. Error: ${err}`);
    }
  }

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

export class OrderWithProductsStore {
  async addProduct(
    order_id: number,
    product_id: number,
    quantity: number,
  ): Promise<OrderWithProductsAndID> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [order_id]);
      const order = result.rows[0];
      if (order.status !== 'active') {
        throw new Error(`Order ${order_id} status is "${order.status}".`);
      }
      conn.release();
    } catch (err) {
      throw new Error(`Could not add a product to an order. Error: ${err}`);
    }

    try {
      const sql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        Number(order_id),
        Number(product_id),
        Number(quantity),
      ]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${product_id} to order ${order_id}. Error: ${err}`,
      );
    }
  }

  async deleteProduct(
    order_id: number,
    product_id: number,
  ): Promise<OrderWithProductsAndID> {
    try {
      const sql =
        'SELECT * FROM orders INNER JOIN order_products ON orders.id = order_products.order_id';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      const order = result.rows[0];
      if (order.status !== 'active') {
        throw new Error(`Order ${order_id} status is "${order.status}".`);
      }
      conn.release();
    } catch (err) {
      throw new Error(
        `Could not delete a product from an order. Error: ${err}`,
      );
    }

    try {
      const sql =
        'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [order_id, product_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(
        `Could not delete product ${product_id} from order ${order_id}. Error: ${err}`,
      );
    }
  }
}
