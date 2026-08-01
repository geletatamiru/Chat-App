const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('../routes/auth');
const message = require('../routes/message')
const error = require('../middleware/error');
const user = require('../routes/user');
const googleAuth = require('../routes/googleAuth');

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://127.0.0.1:5173',
].filter(Boolean);

module.exports = function(app){
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }));
  app.use('/api/auth', auth);
  app.use('/auth/google', googleAuth);
  app.use('/api/messages', message);
  app.use('/api/users', user);
  app.use(error);
}

