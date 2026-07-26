const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, colorize, simple, errors, printf } = format;

const logger = createLogger({
  level: 'info',   
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log', level: 'error' }),
  ],
});

if(process.env.NODE_ENV !== 'production'){
  logger.add(new transports.Console({
    fomat: combine(
      colorize(),
      simple(),
    )
  }))
}

module.exports = logger;
