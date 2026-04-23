const Message = require('../models/Message.cjs');
const User = require('../models/User.cjs');

// Helper: generate a stable conversationId from two user IDs
const getConversationId = (id1, id2) => {
    return [id1.toString(), id2.toString()].sort().join('_');
};

// Send a message
const sendMessage = async (req, res) => {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content || content.trim() === '') {
        return res.status(400).json({ message: 'Receiver and content are required.' });
    }

    try {
        const conversationId = getConversationId(senderId, receiverId);
        const message = new Message({ senderId, receiverId, conversationId, content: content.trim() });
        await message.save();

        // Populate sender info before returning
        await message.populate('senderId', 'name role');
        res.status(201).json(message);
    } catch (error) {
        console.error('sendMessage error:', error);
        res.status(500).json({ message: 'Failed to send message.' });
    }
};

// Get conversation between logged-in user and another user
const getConversation = async (req, res) => {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    try {
        const conversationId = getConversationId(userId, otherUserId);
        const messages = await Message.find({ conversationId })
            .populate('senderId', 'name role')
            .sort({ createdAt: 1 }); // oldest first

        // Mark messages sent TO current user as read
        await Message.updateMany(
            { conversationId, receiverId: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json(messages);
    } catch (error) {
        console.error('getConversation error:', error);
        res.status(500).json({ message: 'Failed to fetch messages.' });
    }
};

// Get all conversations (inbox) for the logged-in user
const getInbox = async (req, res) => {
    const userId = req.user.id;

    try {
        // Get the most recent message from each conversation involving this user
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        })
            .sort({ createdAt: -1 })
            .populate('senderId', 'name role')
            .populate('receiverId', 'name role');

        // De-duplicate by conversationId, keeping only the latest message per thread
        const seen = new Set();
        const inbox = [];
        for (const msg of messages) {
            if (!seen.has(msg.conversationId)) {
                seen.add(msg.conversationId);
                inbox.push(msg);
            }
        }

        res.json(inbox);
    } catch (error) {
        console.error('getInbox error:', error);
        res.status(500).json({ message: 'Failed to fetch inbox.' });
    }
};

// Get unread message count for the logged-in user
const getUnreadCount = async (req, res) => {
    const userId = req.user.id;
    try {
        const count = await Message.countDocuments({ receiverId: userId, isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get unread count.' });
    }
};

module.exports = { sendMessage, getConversation, getInbox, getUnreadCount };
