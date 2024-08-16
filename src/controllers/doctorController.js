import doctorService from "../services/doctorService";

let getDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.error('Error in getDoctorHome controller:', e); // Ghi lại chi tiết lỗi
        return res.status(200).json({ // Sửa lại mã lỗi HTTP
            errCode: -1,
            message: 'Error from service...'
        });
    }
};

let getAllDoctors = async(req,res) =>{
    try{
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)

    }catch(e){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postInforDoctor = async (req, res)=> {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
        
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

const bulkCreateSchedule = async (req, res) => {
    try {
        let data = req.body;  // Lấy dữ liệu từ body request
        let response = await doctorService.bulkCreateSchedule(data);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in bulkCreateSchedule:', error); // Log lỗi chi tiết
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let getScheduleByDate = async (res, req) => {
    try {
        let data = (req.query.doctorId, req.query.date);  // Lấy dữ liệu từ body request
        let response = await doctorService.getScheduleByDate(data);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in bulkCreateSchedule:', error); // Log lỗi chi tiết
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}

module.exports = {
    getDoctorHome: getDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
};
