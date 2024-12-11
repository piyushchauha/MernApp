const jwt =require('jsonwebtoken');
  
const JWT_SECRET="your_jwt_secret_key";

const verifytoken=(req,res,next)=>{
// const token = req.header('Authorization')?.replace('Bearer ', '');
const token = req.header('Authorization')?.replace('Bearer ', '');
 
    if(!token){
        return res.status(401).json({error:"Access denied.No token Provided"});
    }

    try{
        const decoded=jwt.verify(token,JWT_SECRET);

        req.user=decoded;

        next();
    }catch(error){
        res.status(400).json({error:"Invalid or Expired token"})
    }
};

module.exports=verifytoken;