const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, flatId, message } = req.body;
    
    if (!receiverId || !flatId || !message) {
      return res.status(400).json({ message: 'Please provide receiver, flat, and message' });
    }

    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      flatId,
      message
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages between two users for a specific flat
// @route   GET /api/messages/:userId/:flatId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { userId, flatId } = req.params;
    
    const messages = await Message.find({
      flatId,
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages
};
