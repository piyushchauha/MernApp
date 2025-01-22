import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key';
// const blacklisttoken=require('../models/BlacklistTokenmodal');
import blacklisttoken from '../models/BlacklistTokenmodal';

interface DecodedToken {
  _id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

const verifytoken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided' });
    return;
  }

  try {
    const blacklistentry = await blacklisttoken.findOne({ token });

    if (blacklistentry) {
      res
        .status(401)
        .json({ message: 'You`re successfully loggedout.please login' });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }
};

export default verifytoken;
