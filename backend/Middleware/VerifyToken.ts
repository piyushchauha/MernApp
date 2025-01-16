import {Request,Response,NextFunction} from 'express';

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';
// const blacklisttoken=require('../models/BlacklistTokenmodal');
const blacklisttoken = require('../models/BlacklistTokenmodal');

interface DecodedToken{
  _id:string;
  email:string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}


const verifyToken = async (req:Request, res:Response, next:NextFunction):Promise<Response|void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  try {
    const blacklistentry = await blacklisttoken.findOne({ token });

    if (blacklistentry) {
      return res
        .status(401)
        .json({ message: 'You`re successfully loggedout.please login' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = decoded;
    next();
  } catch {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;