// models/Notifikasi.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notifikasi extends Model {
      static associate(models) {
        Notifikasi.belongsTo(models.User,{
            foreignKey : 'id_user',
            as:'User'
          })
      }
    }
Notifikasi.init({
    id: {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey: true,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
    },
    judul_notifikasi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi_notifikasi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status_notifikasi: {
        type: DataTypes.STRING,
        defaultValue: 'belum dibaca'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Notifikasi',
    tableName: 'notifikasi',
    timestamps: true
});
  console.log('Notifikasi model initialized');
  return Notifikasi;
};