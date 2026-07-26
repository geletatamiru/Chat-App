const express = require('express');
const auth = require('../middleware/auth');
const {getMessages, getUnreadCounts, createMessage, updateMessage, deleteMessage} =  require("../controllers/message.controller")
const router = express.Router();

router.get('/:id', auth, getMessages)
router.get('/unread/count', auth, getUnreadCounts);
router.post('/', auth, createMessage)
router.put('/mark-read', auth, updateMessage);
router.delete('/:id', auth, deleteMessage);

module.exports = router;