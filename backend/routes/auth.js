const { User, genetateToken } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post('/',async (req, res) => {
  const { error } = validateUser(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email.toLowerCase().trim()});
  if(!user) return res.status(404).send('Invalid email or password');


  const isValid = await bcrypt.compare(req.body.password, user.password);
  if(!isValid) return res.status(404).send('Invalid email or password');
  const token = genetateToken();
  res
    .header('x-auth-token', token)
    .status(201)
    .send({ message: "Logged in successfully" }, token);
})
function validateUser(user){
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  })
  return schema.validate(user);
}
module.exports = router;