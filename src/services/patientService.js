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
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let token = uuidv4();
                // Send mail
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });

                // Create or find user already exits
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
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
                        where: { patientId: user[0].id, date: data.date, timeType: data.timeType },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            isBooked: true 
                        }});}
                resolve({
                    data: user,
                    errCode: 0,
                    errMessage: 'Booking successfully!'});
            }
        } catch (e) {
            reject(e);
        }
    });
};

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

let getProfilePatientById = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: patientId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                        },
                      
                    ],
                    raw: false,
                    nest: true
                });

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let addMedicalRecord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.diagnosis || !data.medicines || !data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                await db.MedicalRecord.create({
                    diagnosis: data.diagnosis,
                    medicines: JSON.stringify(data.medicines), // Save selected medicines as a JSON array
                    note: data.note,
                    userId: data.userId,  // Associate the record with the patient
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Medical record added successfully!',
                });
            }
        } catch (e) {
            reject({
                errCode: -1,
                errMessage: 'Error from the server',
            });
        }
    });
};


let getMedicalRecordsByPatientId = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                // Query to fetch medical records with patient's details
                let medicalRecords = await db.MedicalRecord.findAll({
                    where: { userId: patientId },
                    include: [
                        {
                            model: db.User,
                            as: 'patient',
                            attributes: ['firstName', 'lastName'], // Include patient name
                        },
                    ],
                    raw: true,
                    nest: true, // Ensures nested objects structure is returned
                });

                resolve({
                    errCode: 0,
                    data: medicalRecords,
                });
            }
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: 'Error from the server',
            });
        }
    });
};


let handleGetPatientProfile = async (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter: patientId',
                });
            } else {
                let patientInfo = await db.User.findOne({
                    where: { id: patientId },
                    include: [
                        {
                            model: db.MedicalRecord,  // Kết hợp với bảng MedicalRecord để lấy thông tin hồ sơ bệnh án
                            as: 'medicalRecords'
                        }
                    ],
                    raw: false, // raw: false để đảm bảo có thể lấy quan hệ giữa các bảng
                    nest: true // nest: true để lấy được dữ liệu lồng nhau
                });

                if (!patientInfo) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Patient not found',
                    });
                } else {
                    resolve({
                        errCode: 0,
                        data: {
                            patientInfo,
                            medicalRecords: patientInfo.medicalRecords,
                        }
                    });
                }
            }
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: 'Error from the server',
                error
            });
        }
    });
};

let getAllPatients = async (patientId) => {
    try {
        let patients = '';
        
        if (patientId === 'All') {
            // Lấy tất cả các bệnh nhân
            patients = await db.User.findAll({
                where: { roleId: 'R3' },  // Chỉ lấy các bệnh nhân có roleId là 'R3'
                include: [
                    {
                        model: db.Allcode,
                        as: 'genderData', 
                        attributes: ['valueVi', 'valueEn']
                    },
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['valueVi', 'valueEn']
                    }
                ],
                attributes: ['id', 'firstName', 'lastName', 'roleId', 'positionId', 'address', 'phonenumber', 'email'],
            });
        } else {
            // Lấy bệnh nhân cụ thể theo ID
            patients = await db.User.findOne({
                where: { id: patientId, roleId: 'R3' },  // Lấy bệnh nhân có ID cụ thể và roleId là 'R3'
                include: [
                    {
                        model: db.Allcode,
                        as: 'genderData',
                        attributes: ['valueVi', 'valueEn']
                    },
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['valueVi', 'valueEn']
                    }
                ],
                attributes: ['id', 'firstName', 'lastName', 'roleId', 'positionId', 'address', 'phonenumber', 'email'],
            });
        }

        if (!patients) {
            return {
                errCode: 2,
                message: 'No patient found'
            };
        }

        return {
            errCode: 0,
            message: 'OK',
            data: patients
        };

    } catch (error) {
        console.error("Error in patientService:", error); // Log lỗi ra console
        return {
            errCode: 1,
            message: 'Error fetching patient data'
        };
    }
};

let getBookingHistoryByPatientId = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter: patientId',
                });
            } else {
                let bookings = await db.Booking.findAll({
                    where: { patientId: patientId },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['firstName', 'lastName', 'email', 'address'], // Các thuộc tính của bệnh nhân
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueEn', 'valueVi'] // Thuộc tính của timeType
                        }
                    ],
                    attributes: ['id','date', 'statusId', 'timeType'], // Các thuộc tính của Booking
                    raw: true,
                    nest: true
                });

                resolve({
                    errCode: 0,
                    data: bookings
                });
            }
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: 'Error from the server',
                error: error.message
            });
        }
    });
};

let deleteBookingById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm booking theo ID
            let foundBooking = await db.Booking.findOne({
                where: { id: id }
            });

            if (!foundBooking) {
                // Nếu không tìm thấy booking, trả về mã lỗi
                resolve({
                    errCode: 2,
                    errMessage: "Booking does not exist"
                });
                return;
            }

            // Xóa booking
            await db.Booking.destroy({
                where: { id: id }
            });

            // Trả về thành công
            resolve({
                errCode: 0,
                message: "Booking deleted successfully"
            });
        } catch (error) {
            // Bắt lỗi trong quá trình xóa
            reject({
                errCode: -1,
                errMessage: "Error from the server"
            });
        }
    });
};







module.exports = {
    postBookAppoinment: postBookAppoinment,
    postVerifyBookAppoinment: postVerifyBookAppoinment,
    getProfilePatientById: getProfilePatientById,
    addMedicalRecord: addMedicalRecord,
    getMedicalRecordsByPatientId: getMedicalRecordsByPatientId,
    handleGetPatientProfile: handleGetPatientProfile,
    getAllPatients: getAllPatients,
    getBookingHistoryByPatientId: getBookingHistoryByPatientId,
    deleteBookingById: deleteBookingById

};
