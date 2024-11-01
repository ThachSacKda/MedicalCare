const db = require('../models');

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

module.exports = {
    getAppointmentStatistics,
};
