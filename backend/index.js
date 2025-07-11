const register = require('./routes/register');
const auth = require('./routes/auth');
const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use('/register', register);
app.use('/auth', auth)
app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
})