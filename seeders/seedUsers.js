// seeders/seedUsers.js
const bcrypt = require('bcrypt');
const { QueryInterface, Sequelize } = require('sequelize');
const User = require('../models/user');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const hashedPasswordMahasiswa = await bcrypt.hash('angel123', 10);

    await User.bulkCreate([
      {
        email: 'admin@gmail.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        nama: 'Admin',
        no_id:'12345',
        alamat: 'Padang',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'angeliputrirahmadhani19@gmail.com',
        password: hashedPasswordMahasiswa,
        role: 'mahasiswa',
        nama: 'Angeli Putri Rahmadhani',
        no_id: '2211522019',
        alamat: 'Batusangkar',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('userss', null, {});
  }
};
