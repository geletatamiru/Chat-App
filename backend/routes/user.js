const { User } = require('../models/user');
const express = require('express');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

router.get('/', auth, asyncMiddleware(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user.id } }).select("-password");
    res.json({success: true, message: "successfully fetched users.",users});
}))
module.exports = router;