const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const register = require('../routes/register');
const auth = require('../routes/auth');
const messages = require('../routes/messages')
const error = require('../middleware/error');
const users = require('../routes/users');

module.exports = function(app){
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use('/api/auth', auth)
  app.use('/api/messages', messages);
  app.use('/api/users', users);
  app.use(error);
}

