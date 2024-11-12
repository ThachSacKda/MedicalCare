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

const getMessagesBetweenUsers = async (senderId, receiverId) => {
    try {
        const messages = await db.Message.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    { senderId, receiverId },
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

const getUnreadMessagesCount = async (userId) => {
    try {
        const messages = await db.Message.findAll({
            where: {
                receiverId: userId,
                isRead: false
            },
            attributes: ['senderId', [db.Sequelize.fn('COUNT', 'senderId'), 'count']],
            group: ['senderId'],
            raw: true  // Thêm `raw: true` để nhận kết quả là plain object
        });

        // Chuyển đổi mảng `messages` thành đối tượng `{ partnerId: count }`
        const unreadCounts = messages.reduce((acc, message) => {
            acc[message.senderId] = message.count;  // Truy cập trực tiếp `message.senderId` và `message.count`
            return acc;
        }, {});

        return { errCode: 0, unreadCounts };
    } catch (error) {
        console.error("Error fetching unread messages count:", error);
        return { errCode: 1, errMessage: 'Failed to count unread messages.' };
    }
};


const markMessagesAsRead = async (senderId, receiverId) => {
    try {
        await db.Message.update(
            { isRead: true, readAt: new Date() },
            {
                where: {
                    senderId,
                    receiverId,
                    isRead: false
                }
            }
        );
        return { errCode: 0, message: 'Messages marked as read' };
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return { errCode: 1, message: 'Error marking messages as read' };
    }
};

module.exports = {
    sendMessage,
    getMessagesBetweenUsers,
    getAllMessagesForUser, getUnreadMessagesCount, markMessagesAsRead
};
