"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const userexists = yield User.findOne({ email });
        if (userexists) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        // const hashpassword=await bcrypt.hash(password,10);
        // const userAdded=await User.create({name,email,originalpassword:password,password:hashpassword});
        const userAdded = yield User.create({ name, email, password: password });
        res.status(201).json(userAdded);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
}));
// get all user operation
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showAll = yield User.find();
        res.status(200).json(showAll);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
    }
}));
// get single user operation
router.get('/:id', verifytoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const singleUser = yield User.findById(id);
        res.status(200).json(singleUser);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}));
// delete operation
router.delete('/:id', verifytoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const singleUser = yield User.findByIdAndDelete(id);
        if (!singleUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).json();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
}));
// patch operation
router.patch('/:id', verifytoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updateUser = yield User.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updateUser);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
}));
//post operation login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
}));
//Post Blacklist token
router.post('/logout', verifytoken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const expiresAt = new Date(decoded.exp * 1000);
            yield blacklisttoken.create({
                token,
                expiresAt,
            });
            res.status(200).json({ message: 'Successfully logged out' });
        }
        else {
            return res.status(400).json({ error: 'No token provided' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(501).json({ error: error.message });
        }
    }
}));
module.exports = router;
