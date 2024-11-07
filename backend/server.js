const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
const User=require("./models/userModel");
app.use(express.json());
mongoose.connect(process.env.URI).then(()=>{
    console.log("Connected Sucessfully");
    app.listen(process.env.PORT||8000,(err)=>{
        if(err) console.log(err);
        console.log("Running Sucessfully at",process.env.PORT)
    });
});
app.post("/", async(req,res)=>{
  const{name,email,password}=req.body;
  try{
    const userAdded=await User.create({
    name:name,
    email:email,
    password:password,
});
res.status(201).json(userAdded);
  }
  catch(error){
    console.log(error);
    res.status(400).json({error:error.message});
  }
});
app.get("/",async(req,res)=>{
    try{
        const showAll=await er.find();
        res.status(200).json(showAll);
    }catch(error){
        console.log(error);
        res.status(400).json({error:error.message});
    }
    res.send("api is running");
});