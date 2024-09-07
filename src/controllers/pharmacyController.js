const pharmacyService = require('../services/pharmacyService');
import db from "../models/index"; // Import Sequelize models

// Create a new medicine
let createNewMedicine = async (req, res) => {
    try {
        let response = await pharmacyService.createNewMedicine(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in createNewMedicine controller:', error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
};

// Get all medicines
let getAllMedicines = async (req, res) => {
    try {
        let response = await pharmacyService.getAllMedicines();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in getAllMedicines controller:', error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
};

// Update a medicine in pharmacyController.js
let updateMedicine = async (req, res) => {
    try {
        let response = await pharmacyService.updateMedicine(req.body); // Lấy thông tin thuốc từ body của yêu cầu
        return res.status(200).json(response); // Trả về phản hồi
    } catch (error) {
        console.error('Error in updateMedicine controller:', error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the serverrrrr'
        });
    }
};


let deleteMedicine = async (req, res) => {
    const id = req.body.id; // Lấy ID từ body
    if (!id) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing required parameter: id"
        });
    }

    try {
        let message = await pharmacyService.deleteMedicine(id);
        return res.status(200).json({
            errCode: 0, // Đảm bảo rằng bạn trả về errCode: 0 khi xóa thành công
            errMessage: "Medicine deleted successfully",
            data: message // Có thể thêm thông tin trả về
        });
    } catch (error) {
        console.error("Error in deleteMedicine controller:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from the server"
        });
    }
};




module.exports = {
    createNewMedicine,
    getAllMedicines,
    updateMedicine,
    deleteMedicine
};

