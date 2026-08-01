const qs = require('querystring');
const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createRefreshToken} = require("../utils/token");
const  {User} = require('../models/user');
const router = express.Router();

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

router.get('/', (req, res) => {
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',           
    scope: 'openid email profile',  
    access_type: 'offline',         
    prompt: 'consent',              
  };
  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify(params)}`;
  res.redirect(googleAuthURL);
})

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).json({success: false, error: "Missing Code"});

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const profile = userInfoResponse.data; 

    const email = profile.email.toLowerCase().trim();
    let user = await User.findOne({ email });
    if (user) {
      const providers = user.providers || ["local"];

      if (!providers.includes("google")) {
        user.googleId = profile.sub;
        user.providers = [...providers, "google"];
        await user.save();
      } else if (!user.googleId) {
        user.googleId = profile.sub;
        await user.save();
      }
    } else {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        email,
        username: profile.name,
        googleId: profile.sub,
        providers: ["google"],
        password: hashedPassword,
      });
    }

    const refreshToken = await createRefreshToken(user._id);
    
    res
      .cookie('refreshToken', refreshToken, getRefreshCookieOptions());
    res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({success: false, message: 'Google OAuth failed'});
  }
});
module.exports = router;
