// models/Notifikasi.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model {
      static associate(models) {
        Feedback.belongsTo(models.User,{
            foreignKey : 'id_user',
            as:'User'
          })
      }
    }
Feedback.init({
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
    ulasan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    respon: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    penilaian: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedback',
    timestamps: true
});
  console.log('Feedback model initialized');
  return Feedback;
};