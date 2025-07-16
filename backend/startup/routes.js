const express = require('express');
const cors = require('cors');
const register = require('../routes/register');
const auth = require('../routes/auth');
const messages = require('../routes/messages')
const error = require('../middleware/error');
const users = require('../routes/users');
module.exports = function(app){
  app.use(express.json());
  app.use(cors({
    exposedHeaders: ['x-auth-token']
  }));
  app.use('/api/register', register);
  app.use('/api/auth', auth)
  app.use('/api/messages', messages);
  app.use('/api/users', users);
  app.use(error);
}

