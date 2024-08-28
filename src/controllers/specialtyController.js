import specialtyService from '../services/specialtyService';

let createSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createSpecialty(req.body); // Sửa lại tên hàm cho đúng
        return res.status(200).json(infor);
    } catch (e) {
        console.error('Error in createSpecialty controller:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
};

module.exports = {
    createSpecialty: createSpecialty
};
