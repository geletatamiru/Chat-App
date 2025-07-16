const mongoose = require('mongoose');
const logger = require('../utils/logger');
module.exports = function(){
  mongoose.connect('mongodb://localhost:27017/chat')
    .then(() => logger.info('Connected to mongoDB'))
}
