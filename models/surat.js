'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Surat extends Model {
    static associate(models) {
    
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
});
  console.log('Surat model initialized');
  return Surat;
};
