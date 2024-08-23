require('dotenv').config(); // Nạp các biến môi trường
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Dùng 'gmail' nếu bạn sử dụng Gmail
        auth: {
            user: process.env.EMAIL_APP, // Đảm bảo bạn lấy biến môi trường đúng
            pass: process.env.EMAIL_APP_PASSWORD, // Đảm bảo mật khẩu đúng
        },
    });

    try {
        let info = await transporter.sendMail({
            from: '"MESSI" <sackda333@gmail.com>', // Địa chỉ người gửi
            to: dataSend.receiverEmail, // Địa chỉ email người nhận
            subject: "Thông tin đặt lịch khám bệnh", // Dòng tiêu đề
            html: `
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
            `
        });

        console.log("Message sent: %s", info.messageId); // Kiểm tra nếu email được gửi thành công
    } catch (error) {
        console.error("Error sending email: ", error); // In ra lỗi nếu có
    }
};

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
};
