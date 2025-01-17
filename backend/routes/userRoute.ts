import { Request, Response, Router } from 'express';

//Jsonwebtoken
import jwt, { JwtPayload } from 'jsonwebtoken';
//Express
// import express from 'express';

//UserModel
import User from '../models/userModel';

//Blacklist-token
import blacklisttoken from '../models/BlacklistTokenmodal';

//Router
const router = Router();

// const bcrypt=require("bcryptjs");
const verifytoken = require('../Middleware/VerifyToken');
// import verifytoken from '../Middleware/VerifyToken';
const JWT_SECRET = 'your_jwt_secret_key';

// post operation
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const userexists = await User.findOne({ email });
    if (userexists) {
      res.status(400).json({ error: 'Email already exists' });
    }
    // const hashpassword=await bcrypt.hash(password,10);

    // const userAdded=await User.create({name,email,originalpassword:password,password:hashpassword});
    const userAdded = await User.create({ name, email, password });
    res.status(201).json(userAdded);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

// get all user operation
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const showAll = await User.find();
    res.status(200).json(showAll);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

// get single user operation
router.get(
  '/:id',
  verifytoken,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const singleUser = await User.findById(id);
      if (singleUser) {
        res.status(200).json(singleUser);
      } else {
        res.status(404).json('Users not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
);

// delete operation
router.delete(
  '/:id',
  verifytoken,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const singleUser = await User.findByIdAndDelete(id);
      if (!singleUser) {
        res.status(404).json({ error: 'User not found' });
      }
      res.status(204).json();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

// patch operation
router.patch(
  '/:id',
  verifytoken,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updateUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(updateUser);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

//post operation login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    //  const isinvalid=await bcrypt.compare(password,user.password);

    //  if(!isinvalid){
    //   return res.status(401).json({ error: "Invalid  password" });

    //  }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '25s',
    });

    res.status(200).json({ message: 'Login successfully', token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

//Post Blacklist token
router.post(
  '/logout',
  verifytoken,
  async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!decoded.exp) {
          res
            .status(400)
            .json({ error: 'Token does not have an expiration date' });
          return;
        }
        const expiresAt = new Date(decoded.exp * 1000);

        await blacklisttoken.create({
          token,
          expiresAt,
        });

        res.status(200).json({ message: 'Successfully logged out' });
      } else {
        res.status(400).json({ error: 'No token provided' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(501).json({ error: error.message });
      }
    }
  }
);

module.exports = router;
