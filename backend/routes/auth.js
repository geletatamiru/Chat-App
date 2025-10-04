const express = require('express');
const asyncMiddleware = require('../middleware/async');
const {signup, verifyEmail, login, resendVerification, forgotPassword, resetPassword, logout, refresh} = require('../controllers/auth.controller');
const router = express.Router();


router.post('/signup', asyncMiddleware(signup));
router.post('/verify-email', asyncMiddleware(verifyEmail));
router.post('/login', asyncMiddleware(login));
router.post('/resend-verification', asyncMiddleware(resendVerification));
router.post('/forgot-password', asyncMiddleware(forgotPassword));
router.post('/reset-password/:token', asyncMiddleware(resetPassword));
router.post('/logout', asyncMiddleware(logout));
router.get('/refresh', asyncMiddleware(refresh));

module.exports = router;