const mongoose = require('mongoose');
const logger = require('../utils/logger');
module.exports = function(){
  mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('Connected to MongoDB Atlas...'))
    .catch(err => logger.error('Could not connect to MongoDB Atlas...', err));
}
