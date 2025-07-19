const express = require('express');
const mongoose = require('mongoose');
const { Message, validateMessage} = require('../models/message');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const router = express.Router();

router.get('/:id', auth,asyncMiddleware( async (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Invalid receiver Id')

  const otherUserId = req.params.id;
  const currentUserId = req.user.id;
  const messages = await Message.find({
    $or: [
      {sender: currentUserId, receiver: otherUserId},
      {sender: otherUserId, receiver: currentUserId},
    ]
  }).sort('createdAt');

  res.send(messages);

}))
router.get('/unread/count', auth,asyncMiddleware( async (req, res) => {
  const receiverId = new mongoose.Types.ObjectId(req.user.id);
  const counts = await Message.aggregate([
    { $match: { receiver: receiverId, read: false }},  
    { $group: { _id: "$sender", count: { $sum: 1 }}},
    { $project: { userId: "$_id", count: 1, _id: 0 }}
  ]);
  res.send(counts); 

}));
router.post('/', auth,asyncMiddleware( async (req, res) => {
  const { error } = validateMessage(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const { receiver, text } = req.body;

  const message = new Message({
    sender: req.user.id,
    receiver,
    text
  })
  await message.save();
  res.status(201).send(message);

}))

module.exports = router;