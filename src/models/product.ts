// Define product model: classes and its methods to interact with the database

import {Client} from '../database';

// Define properties of product types to be used in the ProductStore class

export type Product = {
  name: string;
  price: number;
  category: string;
};

export type ProductWithID = Product & { // extends Product
  id: number;
};

/**
 * Class that interacts with the database to perform CRUD operations on products, contains following methods:
 */
export class ProductStore {
  /**
   * Shows all products from the products table of the database
   *
   * @returns {Promise<ProductWithID[]>} An array of product objects
   */
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

  /**
   * Shows a specific product from the products table of the database
   *
   * @param {string} id - The ID of the product to show
   * @returns {Promise<ProductWithID>} The product object with the provided ID
   */
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

  /**
   * Shows all products from the products table of the database by category
   *
   * @param {string} category - The category of the products to show
   * @returns {Promise<ProductWithID[]>} An array of product objects with the provided category
   */
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

  /** Creates a new product in the products table of the database 
   * 
   * @param {Product} p - The product object to create 
   * @returns {Promise<ProductWithID>} The created product object 
   */
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

  /**
   * Updates a product in the products table of the database
   *
   * @param {ProductWithID} p - The product object to update
   * @returns {Promise<ProductWithID>} The updated product object
   */
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

  /**
   * Deletes a product from the products table of the database
   *
   * @param {string} id - The ID of the product to delete
   * @returns {Promise<ProductWithID>} The deleted product object
   */
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
