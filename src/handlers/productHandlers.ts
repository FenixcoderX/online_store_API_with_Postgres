import express, { Request, Response } from 'express';
import { Product, ProductStore, ProductWithID } from '../models/product';
import { verifyAuthToken } from '../middleware/verification';

const store = new ProductStore();

// handler functions here
const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const indexByCategory = async (req: Request, res: Response) => {
  try {
    const products = await store.indexByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

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

const update = async (req: Request, res: Response) => {
  try {
    const product: ProductWithID = {
      id: Number(req.params.id),
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    const updateProduct = await store.update(product);
    res.json(updateProduct);
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

// Express routes here
const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.get('/products/category/:category', indexByCategory);
  app.post('/products', verifyAuthToken, create);
  app.put('/products/:id', verifyAuthToken, update);
  app.delete('/products/:id', verifyAuthToken, del);
};

export default productRoutes;
