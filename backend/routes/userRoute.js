const jwt=require("jsonwebtoken");
const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const mongoose=require("mongoose");

const JWT_SECRET="your_jwt_secret_key";


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access Denied: No Token Provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid Token" });
    }
    req.user = user; // `user` should include `id` from token payload
    next();
  });
};

// post operation
router.post("/",async(req,res)=>{
  const{name,email,password}=req.body;
  try{
    const userexists=await User.findOne({email});
    if(userexists){
      return res.status(400).json({error:"Email already exists"});
    }
    const userAdded=await User.create({name,email,password});
    res.status(201).json(userAdded);
  }catch(error){
    res.status(400).json({error:error.message});
  }
});

// get all user operation 
router.get("/", async (req, res) => {
  try {
    const showAll = await User.find();
    res.status(200).json(showAll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get single user operation 
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findById(id);
    res.status(200).json(singleUser);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
});

// delete operation 
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findByIdAndDelete(id); 
    if (!singleUser) {
      return res.status(404).json({ error: "User not found" }); 
    }
    res.status(204).json(); 
  } catch (error) {  
    res.status(500).json({ error: error.message });  
  }
});

// patch operation 
router.patch("/:id", async (req, res) => {
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//dashboard get operation
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Welcome to the dashboard", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
