'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    static associate(models) {
      // Define associations if any (currently none)
    }
  }

  Medicine.init(
    {
      medicineName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      composition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uses: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sideEffects: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      manufacturer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Medicine',
    }
  );

  return Medicine;
};
