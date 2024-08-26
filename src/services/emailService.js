require('dotenv').config(); // Load environment variables
import nodemailer from "nodemailer";

// Function to send an email
let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use 'gmail' if using Gmail
        auth: {
            user: process.env.EMAIL_APP, // Ensure correct environment variable
            pass: process.env.EMAIL_APP_PASSWORD, // Ensure correct password
        },
    });

    try {
        let htmlContent = getBodyHTMLEmail(dataSend.language, dataSend);

        let info = await transporter.sendMail({
            from: '"MESSI" <sackda333@gmail.com>', // Sender address
            to: dataSend.receiverEmail, // Receiver's email
            subject: dataSend.language === 'vi' ? "Thông tin đặt lịch khám bệnh" : "Appointment Booking Information", // Subject line
            html: htmlContent // HTML body content based on language
        });

        console.log("Message sent: %s", info.messageId); // Log if email sent successfully
    } catch (error) {
        console.error("Error sending email: ", error); // Log error if any
    }
};

// Function to get the email body HTML based on language
let getBodyHTMLEmail = (language, dataSend) => {
    let result = '';
    if (language === 'vi') {
        result = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #007bff;">Xin chào ${dataSend.patientName},</h2>
                <p>Bạn đã đặt lịch khám bệnh thành công. Dưới đây là thông tin chi tiết:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                    <h3 style="color: #007bff;">Thông tin đặt lịch khám bệnh</h3>
                    <p><strong>Thời gian:</strong> ${dataSend.time}</p>
                    <p><strong>Bác sĩ:</strong> ${dataSend.doctorName}</p>
                </div>
                <p style="margin-top: 20px;">
                    Vui lòng click vào đường dẫn dưới đây để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh:
                </p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${dataSend.redirectLink}" 
                       style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;" 
                       target="_blank">
                        Xác nhận đặt lịch
                    </a>
                </div>
                <p style="margin-top: 30px;">
                    Xin chân thành cảm ơn vì đã tin tưởng dịch vụ của chúng tôi!
                </p>
                <div style="margin-top: 30px; text-align: center;">
                    <p style="font-size: 14px; color: #777;">
                        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại.
                    </p>
                </div>
            </div>
        `;
    } else if (language === 'en') {
        result = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #007bff;">Hello ${dataSend.patientName},</h2>
                <p>You have successfully booked an appointment. Here are the details:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                    <h3 style="color: #007bff;">Appointment Information</h3>
                    <p><strong>Time:</strong> ${dataSend.time}</p>
                    <p><strong>Doctor:</strong> ${dataSend.doctorName}</p>
                </div>
                <p style="margin-top: 20px;">
                    Please click the link below to confirm and complete your appointment booking:
                </p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${dataSend.redirectLink}" 
                       style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;" 
                       target="_blank">
                        Confirm Appointment
                    </a>
                </div>
                <p style="margin-top: 30px;">
                    Thank you for trusting our services!
                </p>
                <div style="margin-top: 30px; text-align: center;">
                    <p style="font-size: 14px; color: #777;">
                        If you have any questions, please contact us via email or phone.
                    </p>
                </div>
            </div>
        `;
    }
    return result;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
};
