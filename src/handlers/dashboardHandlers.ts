import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import { verifyAuthToken } from '../middleware/verification';

const dashboard = new DashboardQueries();

const productsInOrders = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.productsInOrders();
    res.json(products);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

const usersWithOrders = async (_req: Request, res: Response) => {
  try {
    const users = await dashboard.usersWithOrders();
    res.json(users);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

const fiveMostExpensive = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.fiveMostExpensive();
    res.json(products);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

const fiveMostPopular = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.fiveMostPopular();
    res.json(products);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

const dashboardRoutes = (app: express.Application) => {
  app.get('/products_in_orders', verifyAuthToken, productsInOrders),
    app.get('/users-with-orders', verifyAuthToken, usersWithOrders),
    app.get('/five-most-expensive', fiveMostExpensive),
    app.get('/five-most-popular', fiveMostPopular);
};

export default dashboardRoutes;
