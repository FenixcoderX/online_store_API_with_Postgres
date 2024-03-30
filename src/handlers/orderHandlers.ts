// Handlers for Order routes

import express, { Request, Response } from 'express';
import { OrderWithID, Order, OrderWithProductsNoQuantity, OrderWithProducts, OrderStore, OrderWithProductsStore } from '../models/order';
import { verifyAuthToken } from '../middleware/verification';

// Create a new store object of the OrderStore class to use its methods in the handler functions below
const store = new OrderStore();

// Handler functions here

/**
 * Shows all orders from the store
 *
 * @param {Request} _req - The request object (unused)
 * @param {Response} res - The response object used to send the orders information
 */
const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Shows a specific order by its ID
 *
 * @param {Request} req - The request object containing the order ID
 * @param {Response} res - The response object used to send the order information
 */
const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Shows the current (active) order of a specific user by their ID
 *
 * @param {Request} req - The request object containing the user ID
 * @param {Response} res - The response object used to send the order information
 */
const currentOrder = async (req: Request, res: Response) => {
  try {
    const order = await store.currentOrder(req.params.user_id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Shows completed orders of a specific user by their ID
 *
 * @param {Request} req - The request object containing the user ID
 * @param {Response} res - The response object used to send the orders information
 */
const completedOrders = async (req: Request, res: Response) => {
  try {
    const orders = await store.completedOrders(req.params.user_id);
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Creates a new order
 *
 * @param {Request} req - The request object containing the order information to create
 * @param {Response} res - The response object used to send the new order information
 */
const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      status: req.body.status,
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Updates an order by its ID
 *
 * @param {Request} req - The request object containing the order ID and information to update
 * @param {Response} res - The response object used to send the updated order information
 */
const update = async (req: Request, res: Response) => {
  try {
    const order: OrderWithID = {
      id: Number(req.params.id),
      user_id: req.body.user_id,
      status: req.body.status,
    };
    const updateOrder = await store.update(order);
    res.json(updateOrder);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Deletes an order by its ID
 *
 * @param {Request} req - The request object containing the order ID to delete
 * @param {Response} res - The response object used to send the deleted order information
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

// Create a new storeProducts object of the OrderWithProductsStore class to use its methods in the handler functions below
const storeProducts = new OrderWithProductsStore();

// Handler functions here

/**
 * Adds a product to a specific order
 *
 * @param {Request} req - The request object containing the order ID and product information to add
 * @param {Response} res - The response object used to send the added product information
 */
const addProduct = async (req: Request, res: Response) => {
  try {
    const orderWithProducts: OrderWithProducts = {
      order_id: Number(req.params.order_id),
      product_id: req.body.product_id,
      quantity: req.body.quantity,
    };
    const addedProduct = await storeProducts.addProduct(orderWithProducts.order_id, orderWithProducts.product_id, orderWithProducts.quantity);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

/**
 * Deletes a product from a specific order
 *
 * @param {Request} req - The request object containing the order ID and product information to delete
 * @param {Response} res - The response object used to send the deleted product information
 */
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const orderWithProducts: OrderWithProductsNoQuantity = {
      order_id: Number(req.params.order_id),
      product_id: req.body.product_id,
    };
    const deletedProduct = await storeProducts.deleteProduct(orderWithProducts.order_id, orderWithProducts.product_id);
    res.json(deletedProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

// Express routes here

const orderRoutes = (app: express.Application) => {
  
  // Route to show all orders
  app.get('/orders', verifyAuthToken, index), 

  // Route to show a specific order
  app.get('/orders/:id', verifyAuthToken, show), 

  // Route to show the current order
  app.get('/orders/current/:user_id', verifyAuthToken, currentOrder), 

  // Route to show completed orders
  app.get('/orders/completed/:user_id', verifyAuthToken, completedOrders), 

  // Route to create a new order
  app.post('/orders', verifyAuthToken, create), 

  // Route to update an order
  app.put('/orders/:id', verifyAuthToken, update), 

  // Route to delete an order
  app.delete('/orders/:id', verifyAuthToken, del), 

  // Route to add a product to an order
  app.post('/orders/:order_id/products', verifyAuthToken, addProduct), 
  
  // Route to delete a product from an order
  app.delete('/orders/:order_id/products', verifyAuthToken, deleteProduct);
};

export default orderRoutes;
