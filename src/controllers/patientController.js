import patientService from '../services/patientService'

let postBookAppoinment = async (req, res) => {
    try {

        let infor = await patientService.postBookAppoinment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.error('Error in getExtraInforDoctorById controller:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
}
let postVerifyBookAppoinment = async (req, res) => {
    try {
        console.log('Received query params:', req.query);

        // Truyền req.query thay vì req.body
        let infor = await patientService.postVerifyBookAppoinment(req.query);
        return res.status(200).json(infor);
    } catch (e) {
        console.error('Error in postVerifyBookAppoinment controller:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
}

let getProfilePatientById = async (req, res) => {
    try {
        console.log('Received query params:', req.query);

        let infor = await patientService.getProfilePatientById(req.query.patientId);
        return res.status(200).json(infor);
    } catch (e) {
        console.error('Error in getExtraInforDoctorById controller:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
};


let addMedicalRecord = async (req, res) => {
    try {
        let info = await patientService.addMedicalRecord(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.error('Error in addMedicalRecord controller:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server',
        });
    }
};


let getMedicalRecordsByPatientId = async (req, res) => {
    try {
        let patientId = req.params.patientId;
        let result = await patientService.getMedicalRecordsByPatientId(patientId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server',
        });
    }
};


let handleGetPatientProfile = async (req, res) => {
    try {
        let patientId = req.params.patientId;  // Lấy patientId từ URL params
        if (!patientId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Missing required parameter: patientId',
            });
        }

        let result = await patientService.handleGetPatientProfile(patientId);  // Gọi service để xử lý
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server',
            error: error.message,
        });
    }
};




module.exports = {
    postBookAppoinment: postBookAppoinment,
    postVerifyBookAppoinment: postVerifyBookAppoinment,
    getProfilePatientById: getProfilePatientById,
    addMedicalRecord: addMedicalRecord,
    getMedicalRecordsByPatientId: getMedicalRecordsByPatientId,
    handleGetPatientProfile: handleGetPatientProfile
}