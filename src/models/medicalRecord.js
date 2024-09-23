'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      // Associate medical record with the User model
      MedicalRecord.belongsTo(models.User, {
        foreignKey: 'userId', // Linking to the User model
        as: 'patient'
      });
    }
  }

  MedicalRecord.init({
    diagnosis: DataTypes.TEXT,
    medicines: DataTypes.STRING,  // Cập nhật kiểu dữ liệu thành STRING để lưu tên thuốc
    note: DataTypes.TEXT,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'id'
        },
    }
}, {
    sequelize,
    modelName: 'MedicalRecord',
});


  return MedicalRecord;
};
