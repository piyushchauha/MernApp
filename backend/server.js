const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
dotenv.config();
app.use(cors());

const userRoute=require("./routes/userRoute");

app.use(express.json());
mongoose.connect(process.env.URI).then(()=>{
   console.log("Connected Successfully");
   app.listen(process.env.PORT||8000,(err)=>{
        if(err) console.log(err);
        console.log("Running Successfully at",process.env.PORT);
   });
});
app.use(userRoute);