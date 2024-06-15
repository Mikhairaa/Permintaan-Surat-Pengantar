'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Surat extends Model {
    static associate(models) {
      Surat.hasMany(models.Permintaan, {
        foreignKey: 'kode_surat'
      });
    }
  }
Surat.init({
  // define columns
  kode_surat: {
    type : DataTypes.STRING,
    autoIncrement : false,
    primaryKey: true,
    allowNull: false,
  },
  nama_surat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, 
{
  sequelize,
  modelName: "Surat",
  tableName: "surat",
  timestamps: false,
});
  console.log('Surat model initialized');
  return Surat;
};
