import { reject } from "lodash";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import {v4 as uuidv4} from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppoinment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Kiểm tra các tham số bắt buộc
            if (!data.email || !data.doctorId || !data.timeType ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let token = uuidv4();
                
                // Gửi email đơn giản sau khi nhận được dữ liệu
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)

                })

                // Tạo người dùng hoặc tìm người dùng đã tồn tại
                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        gender: data.selectedGender,
                        firstName: data.fullName
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
                            timeType: data.timeType,
                            token: token
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

let postVerifyBookAppoinment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Kiểm tra xem token và doctorId có tồn tại không
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                // Tìm kiếm cuộc hẹn dựa vào doctorId và token
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                });

                // Nếu tìm thấy cuộc hẹn, cập nhật trạng thái
                if (appointment) {
                    appointment.statusId = 'S2';  // Cập nhật trạng thái
                    await appointment.save();  // Lưu lại thay đổi

                    resolve({
                        errCode: 0,
                        errMessage: "Update the appointment success!"
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist"
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    postBookAppoinment: postBookAppoinment,
    postVerifyBookAppoinment: postVerifyBookAppoinment
};
