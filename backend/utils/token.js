const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/refreshToken');

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.jwt_PrivateKey,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
};

const createRefreshToken = async (userId) => {
  const rawToken = crypto.randomBytes(64).toString('hex'); // value we send via cookie
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresInDays = parseInt((process.env.REFRESH_TOKEN_EXPIRES_IN || '30d').replace('d','')) || 30;
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  const rt = new RefreshToken({
    user: userId,
    tokenHash,
    expiresAt,
  });
  await rt.save();

  return rawToken; // return raw token to put in cookie
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.jwt_PrivateKey);
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { createAccessToken, createRefreshToken, verifyAccessToken, hashToken };
