const express = require('express');
const mongoose = require('mongoose');
const { Message, validateMessage} = require('../models/message');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid receiver Id')

  const otherUserId = req.params.id;
  const currentUserId = req.user.id;
  
  try{
    const messages = await Message.find({
      $or: [
        {sender: currentUserId, receiver: otherUserId},
        {sender: otherUserId, receiver: currentUserId},
      ]
    }).sort('createdAt');

    res.send(messages);
  }catch(err){
    res.status(500).send("Failed to fetch messages.");
  }

})

router.post('/', auth, async (req, res) => {
  const { error } = validateMessage(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const { receiver, text } = req.body;

  const message = new Message({
    sender: req.user.id,
    receiver,
    text
  })
  try {
    await message.save();
    res.status(201).send(message);
  }catch(err){
    console.log(err.message);
    res.status(500).send('Internal server error.');
  }

})

module.exports = router;