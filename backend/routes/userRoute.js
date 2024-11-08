const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

// POST operation 
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userAdded = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json(userAdded);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET operation (Show all users)
router.get("/", async (req, res) => {
  try {
    const showAll = await User.find();
    res.status(200).json(showAll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET operation (Get a single user)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findById(id);
    res.status(200).json(singleUser);
  } catch (error) {  // Added the error parameter here
    res.status(500).json({ error: error.message });  // Use 500 for server errors
  }
});

// DELETE operation (Delete a user)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findByIdAndDelete(id); // Fixed: Use id directly
    if (!singleUser) {
      return res.status(404).json({ error: "User not found" }); // Handle case when user is not found
    }
    res.status(204).json();  // 204 for successful deletion with no content
  } catch (error) {  // Added the error parameter here
    res.status(500).json({ error: error.message });  // Use 500 for server errors
  }
});

// PATCH operation (Update a user)
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
    res.status(500).json({ error: error.message });  // Use 500 for server errors
  }
});

module.exports = router;
