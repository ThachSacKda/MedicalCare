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
    medicines: DataTypes.JSON,
    note: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // This should match the table name for users
        key: 'id'
      },
    }
  }, {
    sequelize,
    modelName: 'MedicalRecord',
  });

  return MedicalRecord;
};
