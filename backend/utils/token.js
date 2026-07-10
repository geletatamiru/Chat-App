const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/refreshToken');

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
};

const createRefreshToken = async (userId) => {
  const rawToken = crypto.randomBytes(64).toString('hex'); 
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
 
  const rt = await RefreshToken.create({
    userId,
    tokenHash,
  });

  return rawToken; 
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { createAccessToken, createRefreshToken, verifyAccessToken, hashToken };
