const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/',async (req, res) => {
  const { error } = validateUser(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    username: req.body.username,
    email: req.body.email.toLowerCase().trim(),
    password: hashed
  })

  await user.save();
  res.status(201).send({ message: "User registered successfully" });
})
module.exports = router;