const mongoose = require('mongoose');
const { Message} = require('../models/message');
const messageSchema = require('../validation/messageValidation');

const getMessages = async (req, res) => {
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

  res.status(200).json({success: true, message: "Successfully fetched messages", messages});

}
const getUnreadCounts = async (req, res) => {
  const receiverId = new mongoose.Types.ObjectId(req.user.id);
  const counts = await Message.aggregate([
    { $match: { receiver: receiverId, read: false }},  
    { $group: { _id: "$sender", count: { $sum: 1 }}},
    { $project: { userId: "$_id", count: 1, _id: 0 }}
  ]);
  res.status(200).json({success: true, message: "unread count successfully fetched.", counts})

}
const createMessage = async (req, res) => {
  const parsedMessage = messageSchema.parse(req.body);
  const { receiver, text } = parsedMessage;

  const message = new Message({
    sender: req.user.id,
    receiver,
    text
  })
  await message.save();
  res.status(201).json({success: true, message});

}
const updateMessage = async (req, res) => {

  const {senderId} = req.body;
  const receiverId = req.user.id;
  const result = await Message.updateMany(
      { sender: new mongoose.Types.ObjectId(senderId), receiver: new mongoose.Types.ObjectId(receiverId), read: false },
      { $set: { read: true } }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Messages marked as read.',
    });
}

const deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;
  const message = await Message.findById(messageId);
  if(!message) return res.status(404).json({ success: false, message: 'Message not found'});

  if(message.sender.toString() !== userId && message.receiver.toString() !== userId){
    return res.status(403).json({ success: false, message: 'Not authorized to delete this message'})
  }

  await Message.findByIdAndDelete(messageId);
  res.staus(200).json({ success: true, message: 'Message deleted successfully'});
}
module.exports = {getMessages, getUnreadCounts, createMessage, updateMessage, deleteMessage};