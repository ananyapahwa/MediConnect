const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.cjs');
const { sendMessage, getConversation, getInbox, getUnreadCount } = require('../controllers/chatController.cjs');

// All chat routes require authentication
router.use(verifyToken);

// GET /api/chat/inbox — get all conversations for logged-in user
router.get('/inbox', getInbox);

// GET /api/chat/unread — get unread message count
router.get('/unread', getUnreadCount);

// GET /api/chat/:otherUserId — get full conversation with a specific user
router.get('/:otherUserId', getConversation);

// POST /api/chat — send a new message
router.post('/', sendMessage);

module.exports = router;
