const express = require('express');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const {getMessages, getUnreadCounts, createMessage, updateMessage, deleteMessage} =  require("../controllers/message.controller")
const router = express.Router();

router.get('/:id', auth, asyncMiddleware(getMessages))
router.get('/unread/count', auth, asyncMiddleware(getUnreadCounts));
router.post('/', auth, asyncMiddleware(createMessage))
router.put('/mark-read', auth, asyncMiddleware(updateMessage));
router.delete('/:id', auth, asyncMiddleware(deleteMessage));

module.exports = router;