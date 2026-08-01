const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {signupSchema, loginSchema} = require("../validation/authValidation.js");
const {createAccessToken, createRefreshToken, verifyAccessToken, hashToken} = require("../utils/token.js");
const RefreshToken = require('../models/refreshToken.js');

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const signup = async (req, res) => {
    const result = signupSchema.safeParse(req.body);

    if(!result.success)
      return res.status(400).json({ success: false, message: result.error.issues[0].message })

    const email = result.data.email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (existingUser?.providers?.includes("google") && !existingUser.providers.includes("local")) {
        return res
          .status(400)
          .json({ success: false, message: "This email is registered with Google. Please continue with Google." });
    }

    if (existingUser)
        return res
          .status(400)
          .json({ success: false, message: "Email is already registered." });
    

    const hashed = await bcrypt.hash(result.data.password, 10);

    const user = new User({
      username: result.data.username,
      email,
      password: hashed,
    });

    await user.save();

    res.status(201).json({
        success: true, 
        message: "Sign up successfull.", 
    });
}

const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if(!result.success)
    return res.status(400).json({ success: false, message: result.error.issues[0].message })

  const user = await User.findOne({email: result.data.email.toLowerCase().trim()});
  if(!user) return res.status(400).json({success: false, message: 'Invalid email or password'}); 

  if (user.providers?.includes("google") && !user.providers.includes("local")) {
    return res
      .status(400)
      .json({ success: false, message: "This email is registered with Google. Please continue with Google." });
  }
  

  const isValid = await bcrypt.compare(result.data.password, user.password);
  if(!isValid) return res.status(400).json({success: false, message: 'Invalid email or password'});

  const accessToken = createAccessToken(user);
  const refreshToken = await createRefreshToken(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }).json({
    success: true,
    message: "Login Successful",
    accessToken,
    user: {
      id: user._id,
      username: user.username,
    }
  })
}



const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if(!token) return res.status(200).json({success: true, message: 'Already logged out' });

  const tokenHash = hashToken(token);

  await RefreshToken.deleteOne({ tokenHash })
  
  res.clearCookie('refreshToken', {
    ...refreshCookieOptions,
  });
  res.status(200).json({success: true, message: "Logged out successfully."})
}

const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if(!token) return res.status(401).json({success: false, message: 'No refresh token provided'})
  
  const tokenHash = hashToken(token);
  const storedToken = await RefreshToken.findOne({ tokenHash });

  if(!storedToken) return res.status(403).json({ message: 'Invalid or expired refresh token' });


  const user = await User.findById(storedToken.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const accessToken = createAccessToken(user);
  const newRefreshToken = await createRefreshToken(user._id);

  res.cookie('refreshToken', newRefreshToken, {
    ...refreshCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }).json({
    success: true,
    message: "Successfully refreshed",
    accessToken,
    user: {
      id: user._id,
      username: user.username,
    }
  })
}


module.exports = {signup, login, logout, refresh};




