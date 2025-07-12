const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/',async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
     const existingUser = await User.findOne({ email: req.body.email.toLowerCase().trim() });

    if (existingUser)
      return res.status(409).send("Email is already registered.");

    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email.toLowerCase().trim(),
      password: hashed,
    });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  }catch (error) {
    console.error("Registration Error:", err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
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