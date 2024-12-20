const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_jwt_secret_key";
// const blacklisttoken=require('../models/BlacklistTokenmodal');
const blacklisttoken = require('../models/BlacklistTokenmodal');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  try {
    const blacklisttoken=await blacklisttoken.findOne({token});
    
    if(blacklisttoken){
        return res.status(401).json({message:"You're successfully loggedout.please login"});
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
