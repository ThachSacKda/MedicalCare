// services/messagesService.js

const db = require('../models'); // Import models từ Sequelize

// Gửi tin nhắn mới
const sendMessage = async (data) => {
    try {
        const message = await db.Message.create({
            senderId: data.senderId,
            receiverId: data.receiverId,
            messageText: data.messageText,
            sentAt: new Date()
        });
        return { errCode: 0, message };
    } catch (error) {
        console.error(error);
        return { errCode: 1, errMessage: 'Failed to send message.' };
    }
};

// Lấy tin nhắn giữa hai người dùng
const getMessagesBetweenUsers = async (senderId, receiverId) => {
    try {
        const messages = await db.Message.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            order: [['sentAt', 'ASC']]
        });
        return { errCode: 0, messages };
    } catch (error) {
        console.error(error);
        return { errCode: 1, errMessage: 'Failed to retrieve messages.' };
    }
};

// Lấy tất cả tin nhắn của một người dùng
const getAllMessagesForUser = async (userId) => {
    try {
        const messages = await db.Message.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            order: [['sentAt', 'ASC']]
        });
        console.log("Fetched messages from database:", messages); // Log messages to check format
        return { errCode: 0, messages };
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { errCode: 1, errMessage: 'Failed to retrieve messages.' };
    }
};

module.exports = {
    sendMessage,
    getMessagesBetweenUsers,
    getAllMessagesForUser
};
