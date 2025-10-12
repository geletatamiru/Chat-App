const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {signupSchema, loginSchema} = require("../validation/authValidation.js");
const {createAccessToken, createRefreshToken, verifyAccessToken, hashToken} = require("../utils/token.js");
const {sendVerificationEmail, sendVerificationSuccessEmail, sendResetPasswordEmail, sendResetSuccessEmail} = require("../utils/mailer.js");
const RefreshToken = require('../models/refreshToken.js');

const signup = async (req, res) => {
    const userSchema = signupSchema.parse(req.body);
  
    const email = userSchema.email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if(existingUser && existingUser.providers.includes("google")){
      res.status(400).json({success: false, message: "This email is registered with Google. Please sign in using Google."});
    }
    if (existingUser) {
      if (existingUser.isVerified) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already registered." });
      } else {
        existingUser.password = await bcrypt.hash(userSchema.password, 10);
        existingUser.verificationToken = crypto.randomInt(100000, 999999); 
        existingUser.verificationTokenExpires = Date.now() + 1 * 60 * 60 * 1000;

        await existingUser.save();

        await sendVerificationEmail(
          userSchema.email,
          "Verify your email",
          existingUser.verificationToken
        );

        return res.status(200).json({
          success: true,
          message:
            "This email was already registered but not verified. A new verification code has been sent.",
        });
      }
    }


    const hashed = await bcrypt.hash(userSchema.password, 10);
    const verificationToken = crypto.randomInt(100000,999999)

    const user = new User({
      username: userSchema.username,
      email,
      password: hashed,
      verificationToken,
      providers: ["local"],
      verificationTokenExpires: Date.now() +  1 * 60 * 60 * 1000,
    });

    await user.save();

    await sendVerificationEmail(email, "Verify your email", verificationToken);

    res.status(201).json({
        success: true, 
        message: "Check your email for verification code.", 
    });
}

const verifyEmail = async (req, res) => {
  const {email, code} = req.body;
  console.log(email, code);
  const user = await User.findOne({email, verificationToken: code, verificationTokenExpires: {$gt: Date.now()}})

  if(!user) return res.status(401).json({success: false, message: "Invalid or expired token"});

  user.isVerified= true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  await sendVerificationSuccessEmail(user.email, 'Welcome to ArifChat - your account is verified', user.username);

  res.status(200).json({success: true, message: 'Account Verified Successfully.'})
}

const login = async (req, res) => {
  const userSchema = loginSchema.parse(req.body);

  const user = await User.findOne({email: userSchema.email.toLowerCase().trim()});
  if(!user) return res.status(400).json({success: false, message: 'Invalid email or password'}); 
  
  if(user && !user.providers.includes("local")){
    res.status(400).json({success: false, message: "This email is registered with Google. Please sign in using Google."});
  }
  const isValid = await bcrypt.compare(userSchema.password, user.password);
  if(!isValid) return res.status(400).json({success: false, message: 'Invalid email or password'});

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      isVerfied: false,
      message: "Your account is not verified."
    });
  }

  const accessToken = createAccessToken(user);
  const refreshToken = await createRefreshToken(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
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

const resendVerification = async (req, res) => {
  const {email} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(400).json({success: false, message: "User not registered. Please signup."})

  if(user.isVerified) return res.status(400).json({success: false, message: 'This account is already verified, please log in.'})

  const verificationToken = crypto.randomInt(100000, 999999);
  const verificationTokenExpires = Date.now() + 1 * 60 * 60 * 1000;

  user.verificationToken = verificationToken;
  user.verificationTokenExpires = verificationTokenExpires;

  await user.save();

  await sendVerificationEmail(email, "Verify your email", verificationToken);

  res.status(201).json({
      success: true, 
      message: "Verfication code resent to your email.", 
  });


} 

const forgotPassword = async (req, res) => {
  const {email} = req.body;

  const user = await User.findOne({email});

  if(!user) res.status(200).json({success: true, message: "If an account with that email exists, we've sent a password reset link."});

  if(!user.isVerified) res.status(400).json({success: false, message: "Please verify your account first."});

  const resetPasswordToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000;

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = resetPasswordExpires;

  await user.save();

  const resetUrl =`${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
  await sendResetPasswordEmail(user.email, 'Reset your Password', user.username, resetUrl)
  
  res.status(200).json({success: true, message: "If an account with that email exists, we've sent a password reset link."})

}

const resetPassword = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;

  const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});

  if(!user) res.status(400).json({success: false, message: "Invalid or Expired token"});

  const hashedPassword = await bcrypt.hash(password, 10);
  
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  await sendResetSuccessEmail(user.email, "Reset password successful.")
  
  res.status(200).json({success: true, message: "Reset password successful."})

}

const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if(!token) return res.status(200).json({success: true, message: 'Already logged out' });

  const tokenHash = hashToken(token);
  const refreshTokenDoc = await RefreshToken.findOne({ tokenHash });

  if (refreshTokenDoc) {
    refreshTokenDoc.revoked = true;
    await refreshTokenDoc.save();
  }
  
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({success: true, message: "Logged out successfully."})
}

const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if(!token) return res.status(401).json({success: false, message: 'No refresh token provided'})
  
  const tokenHash = hashToken(token);
  const storedToken = await RefreshToken.findOne({ tokenHash, revoked: false});

  if(!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

  if(storedToken.expiresAt < Date.now()) return res.status(403).json({ message: 'Expired refresh token' });

  const user = await User.findById(storedToken.user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const accessToken = createAccessToken(user);

  res.status(200).json({success: true, message: 'Successfully refreshed', accessToken, user: {  ...user._doc, password: undefined }})
}


module.exports = {signup, verifyEmail, login, resendVerification, forgotPassword, resetPassword, logout, refresh};




