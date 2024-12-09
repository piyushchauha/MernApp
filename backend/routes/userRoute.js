const jwt=require("jsonwebtoken");
const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const JWT_SECRET="your_jwt_secret_key";

// post operation
router.post("/",async(req,res)=>{
  const{name,email,password}=req.body;
  try{
    
    const userexists=await User.findOne({email});
    if(userexists){
      return res.status(400).json({error:"Email already exists"});
    }
    const hashpassword=await bcrypt.hash(password,10);

    const userAdded=await User.create({name,email,password:hashpassword});
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
   const isinvalid=await bcrypt.compare(password,user.password);
   if(!isinvalid){
    return res.status(401).json({ error: "Invalid  password" });

   }
    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get("/profile", async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

//   try {
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized: No token provided" });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Fetch user details
//     const user = await User.findById(decoded.id).select("-password"); // Exclude password field
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// });



module.exports = router;
