const { User } = require('../models/user');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select("-password");
    res.send(users);
  } catch (err) {
    res.status(500).send("Failed to fetch users.");
  }

})
module.exports = router;