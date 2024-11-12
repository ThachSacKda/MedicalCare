// controllers/messagesController.js

const messagesService = require('../services/messagesService');

// Gửi tin nhắn mới
const handleSendMessage = async (req, res) => {
    const { senderId, receiverId, messageText } = req.body;
    if (!senderId || !receiverId || !messageText) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required fields!'
        });
    }
    const response = await messagesService.sendMessage({ senderId, receiverId, messageText });
    return res.status(200).json(response);
};

// Lấy tin nhắn giữa hai người dùng
const handleGetMessagesBetweenUsers = async (req, res) => {
    const { senderId, receiverId } = req.query;
    if (!senderId || !receiverId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required fields!'
        });
    }
    const response = await messagesService.getMessagesBetweenUsers(senderId, receiverId);
    return res.status(200).json(response);
};

// Lấy tất cả tin nhắn của một người dùng
const handleGetAllMessagesForUser = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required fields!'
        });
    }

    const response = await messagesService.getAllMessagesForUser(userId);
    console.log("Messages retrieved for userId:", userId, response); // Log messages to check output

    return res.status(200).json(response);
};

const handleGetUnreadMessagesCount = async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required userId!'
        });
    }

    const response = await messagesService.getUnreadMessagesCount(userId);
    return res.status(200).json(response);
};


const markMessagesAsRead = async (req, res) => {
    const { senderId, receiverId } = req.body;
    const response = await messagesService.markMessagesAsRead(senderId, receiverId);
    return res.status(200).json(response);
};

module.exports = {
    handleSendMessage,
    handleGetMessagesBetweenUsers,
    handleGetAllMessagesForUser, handleGetUnreadMessagesCount,
    markMessagesAsRead
};
