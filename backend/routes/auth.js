const express = require('express');
const asyncMiddleware = require('../middleware/async');
const {signup, login, logout, refresh} = require('../controllers/auth.controller');
const router = express.Router();


router.post('/signup', asyncMiddleware(signup));
router.post('/login', asyncMiddleware(login));
router.post('/logout', asyncMiddleware(logout));
router.post('/refresh', asyncMiddleware(refresh));

module.exports = router;