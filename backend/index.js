require('dotenv').config();
const http = require('http');
const express = require('express');
const logger = require("./utils/logger");
const {setupSocket} = require('./sockets')
require('./startup/logging')();
require('./startup/db')();
const app = express();
require('./startup/routes')(app);

const server = http.createServer(app);
// setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
})

