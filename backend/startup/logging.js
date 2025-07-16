const logger = require('../utils/logger');
module.exports = function(){
  process.on('uncaughtException', (ex) => {
    logger.error('UncaughtException', ex);
    process.exit(1);
})
  process.on("unhandledRejection", (ex) => {
    logger.error('unhandledRejection', ex);
    process.exit(1);
})
}
