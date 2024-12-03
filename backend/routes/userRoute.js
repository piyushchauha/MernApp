const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

// post operation
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const userAdded = await User.create({ name, email, password });
    res.status(201).json(userAdded);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

//get operation login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
