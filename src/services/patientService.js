import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';

let postBookAppoinment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Kiểm tra các tham số bắt buộc
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                // Gửi email đơn giản sau khi nhận được dữ liệu
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: 'https://www.facebook.com/'

                })

                // Tạo người dùng hoặc tìm người dùng đã tồn tại
                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }
                    });
                }

                resolve({
                    data: user,
                    errCode: 0,
                    errMessage: 'Đã lưu thông tin bác sĩ thành công!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    postBookAppoinment: postBookAppoinment
};
