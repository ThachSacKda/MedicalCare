import db from "../models/index"; // Import Sequelize models

// Create a new medicine
let createNewMedicine = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.medicineName || !data.composition || !data.uses || !data.manufacturer) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required fields'
                });
            } else {
                let newMedicine = await db.Medicine.create({
                    medicineName: data.medicineName,
                    composition: data.composition,
                    uses: data.uses,
                    sideEffects: data.sideEffects,
                    imageUrl: data.imageUrl,
                    manufacturer: data.manufacturer
                });
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: newMedicine
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllMedicines = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let medicines = await db.Medicine.findAll();
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: medicines  // Make sure 'data' contains the medicines list
            });
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: 'Error from the server'
            });
        }
    });
};

module.exports = {
    getAllMedicines,
};



let updateMedicine = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Sử dụng phương thức update để cập nhật trực tiếp
            let [updatedRows] = await db.Medicine.update({
                medicineName: data.medicineName,
                composition: data.composition,
                uses: data.uses,
                sideEffects: data.sideEffects || null,
                imageUrl: data.imageUrl || null,
                manufacturer: data.manufacturer || null
            }, {
                where: { id: data.id }
            });

            if (updatedRows === 0) {
                resolve({
                    errCode: 2,
                    errMessage: 'Medicine not found or no changes applied'
                });
            } else {
                resolve({
                    errCode: 0,
                    errMessage: 'Medicine updated successfully'
                });
            }
        } catch (error) {
            console.error("Error during medicine update:", error);
            reject({
                errCode: -1,
                errMessage: 'Error from the server'
            });
        }
    });
};





let deleteMedicine = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let foundMedicine = await db.Medicine.findOne({
                where: { id: id }
            });

            if (!foundMedicine) {
                resolve({
                    errCode: 2,
                    errMessage: "Medicine does not exist"
                });
                return;
            }

            await db.Medicine.destroy({
                where: { id: id }
            });

            resolve({
                errCode: 0,
                message: "Medicine deleted successfully"
            });
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: "Error from the server"
            });
        }
    });
};



module.exports = {
    createNewMedicine,
    getAllMedicines,
    updateMedicine,
    deleteMedicine
};
