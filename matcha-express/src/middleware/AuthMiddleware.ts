// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_jwt_secret_key'; // Make sure to keep this safe and secure

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.url === '/api/user/login' || req.url === '/api/user/register') return next(); // Skip authentication for login and register routes
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token

  if (token == null) return res.sendStatus(401); // If no token, return 401

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403); // If token is invalid, return 403
    // @ts-ignore
    req.user = user;
    next();
  });
};
