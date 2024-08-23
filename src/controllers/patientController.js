import patientService from '../services/patientService'

let postBookAppoinment = async (req, res) => {
    try {
        console.log('Received query params:', req.query);

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

module.exports = {
    postBookAppoinment: postBookAppoinment
}