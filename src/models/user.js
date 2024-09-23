'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Existing associations
      User.belongsTo(models.Allcode,  {foreignKey: 'positionId', targetKey:'keyMap', as: 'positionData'});
      User.belongsTo(models.Allcode,  {foreignKey: 'gender', targetKey:'keyMap', as: 'genderData'});
      User.hasOne(models.Markdown, {foreignKey: 'doctorId'});
      User.hasOne(models.Doctor_infor, {foreignKey: 'doctorId'});
      User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' });
      User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'patientData' });

      // New association: User has many MedicalRecords
      User.hasMany(models.MedicalRecord, {
        foreignKey: 'userId', // Linking to the MedicalRecord model
        as: 'medicalRecords'
      });
      
    }
  }

  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phonenumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
