const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
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
  }
})

const User = mongoose.model('User', userSchema);

function validateUser(user){
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  })
  return schema.validate(user);
}
function genetateToken(){
  const token = jwt.sign({id: this._id, username: this.username}, process.env.jwt_PrivateKey);
  return token;  
}
module.exports = { User, validateUser, genetateToken};