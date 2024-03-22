import express, { Request, Response } from 'express';
import { User, UserStore, UserWithID } from '../models/user';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from '../middleware/verification';

const store = new UserStore();

// handler functions here

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const newUser = await store.create(user);
    var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string); //jwt
    res.json(token); //jwt, token=newUser for further HTTP requests
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user: User = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const u = await store.authenticate(user.username, user.password);

    if (!u) {
      return res.status(401).json('Wrong username-password');
    }

    var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
    //console.log ('authenticate',{ user: u });
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const user: UserWithID = {
      id: Number(req.params.id),
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const updateUser = await store.update(user);
    res.json(updateUser);
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
const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index),
    app.get('/users/:id', verifyAuthToken, show),
    app.post('/users', create),
    app.post('/users/authenticate', authenticate),
    app.put('/users/:id', verifyAuthToken, update),
    app.delete('/users/:id', verifyAuthToken, del);
};

export default userRoutes;
