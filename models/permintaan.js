'use strict';
const { Model } = require('sequelize');
const User = require('./user')

module.exports = (sequelize, DataTypes) => {
  class Permintaan extends Model {
    static associate(models) {
      Permintaan.belongsTo(models.User,{
        foreignKey : 'id_user'
      }),
      Permintaan.belongsTo(models.Surat,{
        foreignKey : 'id_surat'
      })
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
  id_users: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  id_surat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'surat',
      key: 'id_surat'
    }
  },
}, {
  sequelize,
  modelName: 'Permintaan',
  timestamps: true,
});
  console.log('Permintaan model initialized');
  return Permintaan;
};