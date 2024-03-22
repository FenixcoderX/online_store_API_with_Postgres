import express, { Request, Response } from 'express';
import {
  OrderWithID,
  Order,
  OrderWithProductsNoQuantity,
  OrderWithProducts,
  OrderStore,
  OrderWithProductsStore,
} from '../models/order';
import { verifyAuthToken } from '../middleware/verification';

const store = new OrderStore();

// handler functions here

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const currentOrder = async (req: Request, res: Response) => {
  try {
    const order = await store.currentOrder(req.params.user_id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const completedOrders = async (req: Request, res: Response) => {
  try {
    const orders = await store.completedOrders(req.params.user_id);
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

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

const update = async (req: Request, res: Response) => {
  try {
    const order: OrderWithID = {
      id: Number(req.params.id),
      user_id: req.body.user_id,
      status: req.body.status,
    };
    //console.log(order);

    const updateOrder = await store.update(order);
    res.json(updateOrder);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const del = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const storeProducts = new OrderWithProductsStore();

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderWithProducts: OrderWithProducts = {
      order_id: Number(req.params.order_id),
      product_id: req.body.product_id,
      quantity: req.body.quantity,
    };
    const addedProduct = await storeProducts.addProduct(
      orderWithProducts.order_id,
      orderWithProducts.product_id,
      orderWithProducts.quantity,
    );
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const orderWithProducts: OrderWithProductsNoQuantity = {
      order_id: Number(req.params.order_id),
      product_id: req.body.product_id,
    };
    const deletedProduct = await storeProducts.deleteProduct(
      orderWithProducts.order_id,
      orderWithProducts.product_id,
    );
    res.json(deletedProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

// Express routes here
const orderRoutes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, index),
    app.get('/orders/:id', verifyAuthToken, show),
    app.get('/orders/current/:user_id', verifyAuthToken, currentOrder),
    app.get('/orders/completed/:user_id', verifyAuthToken, completedOrders),
    app.post('/orders', verifyAuthToken, create),
    app.put('/orders/:id', verifyAuthToken, update),
    app.delete('/orders/:id', verifyAuthToken, del),
    app.post('/orders/:order_id/products', verifyAuthToken, addProduct),
    app.delete('/orders/:order_id/products', verifyAuthToken, deleteProduct);
};

export default orderRoutes;
