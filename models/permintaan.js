'use strict';
const { Model } = require('sequelize');
const User = require('./user')

module.exports = (sequelize, DataTypes) => {
  class Permintaan extends Model {
    static associate(models) {
      Permintaan.belongsTo(models.User,{
        foreignKey : 'id_user',
        as: 'User'
      });
      Permintaan.belongsTo(models.Surat,{
        foreignKey : 'kode_surat',
        as: 'Surat'
      });
    }
  }
Permintaan.init({
  // define columns
  id: {
    type : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey: true,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  keterangan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tujuan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  kode_surat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'surat',
      key: 'kode_surat'
    }
  },
}, {
  sequelize,
  modelName: 'Permintaan',
  tableName: 'permintaan',
  timestamps: true,
});
  console.log('Permintaan model initialized');
  return Permintaan;
};

