 import clinicService from '../services/clinicService'
let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.error('Error in createSpecialty controller:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
}

module.exports = {
    createClinic: createClinic
}