// Handlers for the dashboard routes

import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import { verifyAuthToken } from '../middleware/verification';

// Create a new object of the DashboardQueries class to use its methods in the handler functions below
const dashboard = new DashboardQueries();

// Handler functions here

/**
 * Shows all products included in orders
 *
 * @param {Request} _req - The request object (unused)
 * @param {Response} res - The response object used to send the products information
 */
const productsInOrders = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.productsInOrders();
    res.json(products);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

/**
 * Shows all users who have made orders
 *
 * @param {Request} _req - The request object (unused)
 * @param {Response} res - The response object used to send the users information
 */
const usersWithOrders = async (_req: Request, res: Response) => {
  try {
    const users = await dashboard.usersWithOrders();
    res.json(users);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

/**
 * Show 5 most expensive products
 *
 * @param {Request} _req - The request object (unused)
 * @param {Response} res - The response object used to send the products information
 */
const fiveMostExpensive = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.fiveMostExpensive();
    res.json(products);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

/**
 * Show 5 most popular products
 *
 * @param {Request} _req - The request object (unused)
 * @param {Response} res - The response object used to send the products information
 */
const fiveMostPopular = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.fiveMostPopular();
    res.json(products);
  } catch (err: any) {
    res.status(400);
    res.json(err.message);
  }
};

// Express routes here

const dashboardRoutes = (app: express.Application) => {
  // Route to show all products included in orders
  app.get('/products_in_orders', verifyAuthToken, productsInOrders),

  // Route to show all users who have made orders
  app.get('/users-with-orders', verifyAuthToken, usersWithOrders),

  // Route to show 5 most expensive products
  app.get('/five-most-expensive', fiveMostExpensive),

  // Route to show 5 most popular products
  app.get('/five-most-popular', fiveMostPopular);
};

export default dashboardRoutes;
