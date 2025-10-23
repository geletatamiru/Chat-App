const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  read: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})
const Message = mongoose.model('Message', messageSchema);


module.exports = { Message };