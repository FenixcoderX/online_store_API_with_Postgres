// Handlers for product routes

import express, { Request, Response } from 'express';
import { Product, ProductStore, ProductWithID } from '../models/product';
import { verifyAuthToken } from '../middleware/verification';

// Create a new store object of the ProductStore class to use its methods in the handler functions below
const store = new ProductStore();

// Handler functions here

/**
 * Shows all products from the store
 *
 * @param {Request} _req - The request object (unused)
 * @param {Response} res - The response object used to send the products information
 */
const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Shows a specific product by its ID
 *
 * @param {Request} req - The request object containing the product ID
 * @param {Response} res - The response object used to send the product information
 */
const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Shows all products by category
 *
 * @param {Request} req - The request object containing the category
 * @param {Response} res - The response object used to send the products information
 */
const indexByCategory = async (req: Request, res: Response) => {
  try {
    const products = await store.indexByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Creates a new product
 *
 * @param {Request} req - The request object containing the product information to create
 * @param {Response} res - The response object used to send the new product information
 */
const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Updates a product by its ID
 *
 * @param {Request} req - The request object containing the product ID and information to update
 * @param {Response} res - The response object used to send the updated product information
 */
const update = async (req: Request, res: Response) => {
  try {
    const product: ProductWithID = {
      id: Number(req.params.id),
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    const updatedProduct = await store.update(product);
    res.json(updatedProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Deletes a product by its ID
 *
 * @param {Request} req - The request object containing the product ID to delete
 * @param {Response} res - The response object used to send the deleted product information
 */
const del = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

// Express routes here

/**
 * Routes for product endpoints
 *
 * @param {express.Application} app - The express application object
 */
const productRoutes = (app: express.Application) => {
  // Route to show all products
  app.get('/products', index);

  // Route to show a specific product
  app.get('/products/:id', show);

  // Route to show all products by category
  app.get('/products/category/:category', indexByCategory);

  // Route to create a new product using middleware to verify the token
  app.post('/products', verifyAuthToken, create);

  // Route to update a product using middleware to verify the token
  app.put('/products/:id', verifyAuthToken, update);

  // Route to delete a product using middleware to verify the token
  app.delete('/products/:id', verifyAuthToken, del);
};

export default productRoutes;
