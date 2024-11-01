const db = require('../models');
const { Op } = require('sequelize');


let getAppointmentStatistics = async () => {
    try {
        // Total appointments
        let totalAppointments = await db.Booking.count();
        console.log("Total appointments:", totalAppointments);

        // Today's appointments
        let todayDate = new Date().toISOString().slice(0, 10); // Current date
        let todayAppointments = await db.Booking.count({
            where: {
                date: todayDate
            }
        });
        console.log("Today's appointments:", todayAppointments);

        // Unconfirmed appointments (statusId = 'S1')
        let unconfirmedAppointments = await db.Booking.count({
            where: {
                statusId: 'S1'
            }
        });
        console.log("Unconfirmed appointments (S1):", unconfirmedAppointments);

        // Confirmed appointments (statusId = 'S2')
        let confirmedAppointments = await db.Booking.count({
            where: {
                statusId: 'S2'
            }
        });
        console.log("Confirmed appointments (S2):", confirmedAppointments);

        return {
            errCode: 0,
            message: 'OK',
            data: {
                totalAppointments,
                todayAppointments,
                unconfirmedAppointments,
                confirmedAppointments
            }
        };
    } catch (error) {
        console.error("Error in getAppointmentStatistics Service:", error);
        return {
            errCode: 1,
            message: "Error fetching appointment statistics"
        };
    }
};

// Hàm chuyển đổi ngày thành thứ trong tuần
const getDayOfWeek = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
};

let getWeeklyBookingStatistics = async () => {
    try {
        // Lấy danh sách tất cả các booking
        const bookings = await db.Booking.findAll({
            attributes: ['date', 'statusId'],
        });

        // Tính số lượng booking theo từng ngày trong tuần và theo trạng thái (S1 và S2)
        const statistics = {
            Monday: { S1: 0, S2: 0 },
            Tuesday: { S1: 0, S2: 0 },
            Wednesday: { S1: 0, S2: 0 },
            Thursday: { S1: 0, S2: 0 },
            Friday: { S1: 0, S2: 0 },
            Saturday: { S1: 0, S2: 0 },
            Sunday: { S1: 0, S2: 0 },
        };

        // Duyệt qua từng booking để tính toán
        bookings.forEach(booking => {
            const dayOfWeek = getDayOfWeek(booking.date);
            const statusId = booking.statusId;

            if (statusId === 'S1' || statusId === 'S2') {
                statistics[dayOfWeek][statusId]++;
            }
        });

        return {
            errCode: 0,
            message: 'OK',
            data: statistics
        };
    } catch (error) {
        console.error("Error in getWeeklyBookingStatistics Service:", error);
        return {
            errCode: 1,
            message: "Error fetching weekly booking statistics"
        };
    }
};


module.exports = {
    getAppointmentStatistics, getWeeklyBookingStatistics
};
