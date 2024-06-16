"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Permintaan, {
        foreignKey: 'id_user'
      });
    }
  }
  User.init(
    {
      id: {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      nama: DataTypes.STRING,
      foto_profil : DataTypes.STRING,
      no_id: DataTypes.STRING,
      alamat: DataTypes.STRING,
      gender: DataTypes.STRING,
      status: DataTypes.STRING,
    
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  console.log('User model initialized');
  return User;
};