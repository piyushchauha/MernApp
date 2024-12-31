//Jsonwebtoken
const jwt = require('jsonwebtoken');

//Express
const express = require('express');

//UserModel
const User = require('../models/userModel');

//Blacklist-token
const blacklisttoken = require('../models/BlacklistTokenmodal');

//Router
const router = express.Router();

// const bcrypt=require("bcryptjs");
const verifytoken = require('../Middleware/VerifyToken');

const JWT_SECRET = 'your_jwt_secret_key';

// post operation
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userexists = await User.findOne({ email });
    if (userexists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    // const hashpassword=await bcrypt.hash(password,10);

    // const userAdded=await User.create({name,email,originalpassword:password,password:hashpassword});
    const userAdded = await User.create({ name, email, password: password });
    res.status(201).json(userAdded);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get all user operation
router.get('/', async (req, res) => {
  try {
    const showAll = await User.find();
    res.status(200).json(showAll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get single user operation
router.get('/:id', verifytoken, async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findById(id);
    res.status(200).json(singleUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete operation
router.delete('/:id', verifytoken, async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findByIdAndDelete(id);
    if (!singleUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// patch operation
router.patch('/:id', verifytoken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//post operation login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    //  const isinvalid=await bcrypt.compare(password,user.password);

    //  if(!isinvalid){
    //   return res.status(401).json({ error: "Invalid  password" });

    //  }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '5s',
    });

    res.status(200).json({ message: 'Login successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Post Blacklist token
router.post('/logout', verifytoken, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const expiresAt = new Date(decoded.exp * 1000);

      await blacklisttoken.create({
        token,
        expiresAt,
      });

      res.status(200).json({ message: 'Successfully logged out' });
    } else {
      return res.status(400).json({ error: 'No token provided' });
    }
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
});

module.exports = router;
