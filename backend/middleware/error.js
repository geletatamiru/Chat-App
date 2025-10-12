const {z} = require("zod");
const logger = require("../utils/logger");

module.exports = function(err, req, res, next){
  if(z instanceof z.ZodError){
    res.status(400).json({success: false, message: err.issues[0].message});
  }else{
    logger.error(err.message, err);
    res.status(500).json({success: false, message: err.message});
  }
}
