'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';
// const blacklisttoken=require('../models/BlacklistTokenmodal');
const blacklisttoken = require('../models/BlacklistTokenmodal');
const verifyToken = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token =
      (_a = req.header('Authorization')) === null || _a === void 0
        ? void 0
        : _a.replace('Bearer ', '');
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Access denied. No token provided' });
    }
    try {
      const blacklistentry = yield blacklisttoken.findOne({ token });
      if (blacklistentry) {
        return res
          .status(401)
          .json({ message: 'You`re successfully loggedout.please login' });
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (_b) {
      return res.status(400).json({ error: 'Invalid token' });
    }
  });
module.exports = verifyToken;
