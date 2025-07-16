const logger = require("../utils/logger");

module.exports = function(err, req, res){
  logger.error(err.message, err);
  res.status(500).send(err.message);
}
