const dashboardService = require('../services/dashboardService');

let getAppointmentStatistics = async (req, res) => {
    try {
        let data = await dashboardService.getAppointmentStatistics();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error in getAppointmentStatistics Controller:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Error fetching appointment statistics"
        });
    }
};

let getWeeklyBookingStatistics = async (req, res) => {
    try {
        let data = await dashboardService.getWeeklyBookingStatistics();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error in getWeeklyBookingStatistics Controller:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Error fetching weekly booking statistics"
        });
    }
};

module.exports = {
    getAppointmentStatistics, getWeeklyBookingStatistics
};
