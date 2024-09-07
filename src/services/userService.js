import db from '../models/index';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }catch(e){
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true,

                });
                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage =  "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }

            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in our system, plz try other email`
            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try{
            let users = '';
            if(userId === 'All'){
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }if(userId && userId !=='All'){
                users = await db.User.findOne({
                    where: { id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }catch(e){
            reject(e);
        }
    })
}


let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let check = await checkUserEmail(data.email);
            if(check===true){
                resolve({
                    errCode: 1,
                    errMessage: "Email alrealdy have, please try an other email"
                })
            }else{
            

            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender,
                roleId: data.roleId,
                positionId: data.positionId,
                image: data.avatar
            })
            resolve({
                errCode: 0,
                message: 'OK'
            })}

        }catch(e){
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: {id: userId}
        })
        if(!foundUser) {
            resolve({
                errCode: 2,
                errMessage: "User not exist"
            })
        }
        await db.User.destroy({
            where: {id: userId}
        })
        resolve({
            errCode: 0,
            message: "User is deleted successfully"
        })

    })
}



let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Data received:', data); // Log để kiểm tra dữ liệu đầu vào

            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter: id"
                });
                return; // Dừng lại nếu không có id
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });

            if (user) {
                // Chỉ cập nhật các trường có giá trị không phải undefined hoặc null
                if (data.firstName !== undefined) user.firstName = data.firstName;
                if (data.lastName !== undefined) user.lastName = data.lastName;
                if (data.address !== undefined) user.address = data.address;
                if (data.roleId !== undefined) user.roleId = data.roleId;
                if (data.positionId !== undefined) user.positionId = data.positionId;
                if (data.gender !== undefined) user.gender = data.gender;
                if (data.phonenumber !== undefined) user.phonenumber = data.phonenumber;
                if(data.avatar){
                    user.image=data.avatar;

                }
                await user.save();

                resolve({
                    errCode: 0,
                    message: "Update user successfully"
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "User not found"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};


let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try{
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require arameter'
                })
            }else{
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {type: typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
            
            
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}