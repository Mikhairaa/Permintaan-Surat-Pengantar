'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifikasi', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          id_user: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id'
            }
          },
          judul_notifikasi: {
            type: Sequelize.STRING,
            allowNull: false
          },
          deskripsi_notifikasi: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          status_notifikasi: {
            type: Sequelize.STRING,
            defaultValue: 'belum dibaca'
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          }
        });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifikasi');
  }
};

