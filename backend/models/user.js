const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  providers: {
    type: [String],
    default: ["local"],
  },
})


const User = mongoose.model('User', userSchema);

module.exports = { User};
