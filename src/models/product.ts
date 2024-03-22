import {Client} from '../database';

export type Product = {
  name: string;
  price: number;
  category: string;
};

export type ProductWithID = Product & {
  id: number;
};

export class ProductStore {
  async index(): Promise<ProductWithID[]> {
    try {
      const sql = 'SELECT * FROM products';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<ProductWithID> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get product by ${id}. Error: ${err}`);
    }
  }

  async indexByCategory(category: string): Promise<ProductWithID[]> {
    try {
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get products by category ${category}. Error: ${err}`,
      );
    }
  }

  async create(p: Product): Promise<ProductWithID> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
    }
  }

  async update(p: ProductWithID): Promise<ProductWithID> {
    try {
      const sql =
        'UPDATE products SET name=$2, price=$3, category=$4 WHERE id=$1 RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [p.id, p.name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not update product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<ProductWithID> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
