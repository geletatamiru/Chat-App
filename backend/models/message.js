const Joi = require('joi');
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
  }
}, {timestamps: true})
const Message = mongoose.model('Message', messageSchema);

function validateMessage(message) {
  const schema = Joi.object({
    receiver: Joi.string().length(24).required()
    .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }),
    text: Joi.string().min(1).max(1000).required(),
  });

  return schema.validate(message);
}

module.exports = { Message, validateMessage };