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


module.exports = {
    postBookAppoinment: postBookAppoinment,
    postVerifyBookAppoinment: postVerifyBookAppoinment
}