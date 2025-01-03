const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';
// const blacklisttoken=require('../models/BlacklistTokenmodal');
const blacklisttoken = require('../models/BlacklistTokenmodal');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  try {
    const blacklistentry = await blacklisttoken.findOne({ token });

    if (blacklistentry) {
      return res
        .status(401)
        .json({ message: 'You`re successfully loggedout.please login' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
