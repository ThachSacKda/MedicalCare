import db from "../models/index";

let getDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                ],
                raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                data: users
            });
        } catch (e) {
            console.error('Error in getDoctorHome:', e); 
            reject(e);
        }
    });
};

let getAllDoctors = () => {
    return new Promise( async (resolve, reject)=> {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: `R2`},
                attributes: {
                    exclude: ['password', 'image']
                },
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async(resolve, reject)=> {
        try {
            if(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else{
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor successfully!'
                })
            }
        } catch (e) {
            
        }
    })
}
let getDetailDoctorById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }else{
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Markdown, 
                        attributes: ['description', 'contentHTML', 'contentMarkdown']
                    },
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},

                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image){
                    data.image = new Buffer(data.image, `base64`).toString(`binary`);

                }
                if(!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getDoctorHome: getDoctorHome,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getAllDoctors: getAllDoctors,
    getDetailDoctorById: getDetailDoctorById,

}
    

