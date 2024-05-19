// seeders/seedUsers.js

const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const hashedPasswordMahasiswa = await bcrypt.hash('mahasiswa123', 10);

    await User.bulkCreate([
      {
        email: 'admin@gmail.com',
        password: hashedPasswordAdmin,
        role: 'admin',
      },
      {
        email: 'mahasiswa@gmail.com',
        password: hashedPasswordMahasiswa,
        role: 'mahasiswa',
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
