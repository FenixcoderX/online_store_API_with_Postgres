import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware function to verify the validity of an authentication token
 *
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The next middleware function
 */
export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string; // Save the token from the authorization header
    const token = authorizationHeader.split(' ')[1]; // Extract the token from the authorization header string (split by space and get the second element)
    jwt.verify(token, process.env.TOKEN_SECRET as string); // Verify the token using the TOKEN_SECRET
    next(); // Call the next middleware function
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token, jwt token must be provided');
  }
};
