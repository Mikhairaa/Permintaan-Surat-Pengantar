'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback', {
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
          ulasan: {
            type: Sequelize.STRING,
            allowNull: false
          },
          respon: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          penilaian: {
            type: Sequelize.INTEGER,
            allowNull: false
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
    await queryInterface.dropTable('feedback');
  }
};

