const mongoose = require('mongoose');
const logger = require('../utils/logger');
module.exports = function(){
  mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('Connected to MongoDB Atlas...'))
}
