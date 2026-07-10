const mongoose = require('mongoose');
const refreshTokenSchema = new mongoose.Schema({ 
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
  }, 
  tokenHash: { 
    type: String, 
    required: true 
  },  
  createdAt: { 
    type: Date, 
    default: Date.now ,
    expires: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  },
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;