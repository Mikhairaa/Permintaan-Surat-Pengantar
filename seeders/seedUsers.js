// seeders/seedUsers.js
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const hashedPasswordAngel = await bcrypt.hash('angel123', 10);
    const hashedPasswordMifta = await bcrypt.hash('mifta123', 10);
    const hashedPasswordDilla = await bcrypt.hash('dilla123', 10);

    await queryInterface.bulkInsert('Users',[
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
        email: 'miftahulkhaira09@gmail.com',
        password: hashedPasswordMifta,
        role: 'mahasiswa',
        nama: 'Miftahul Khaira',
        no_id: '2211521009',
        alamat: 'Batusangkar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'rahmatulfadilla37@gmail.com',
        password: hashedPasswordDilla,
        role: 'mahasiswa',
        nama: 'Rahmatul Fa Dilla',
        no_id: '2211523037',
        alamat: 'Bukittinggi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'angeliputriramadhani19@gmail.com',
        password: hashedPasswordAngel,
        role: 'mahasiswa',
        nama: 'Angeli Putri Ramadhani',
        no_id: '2211522019',
        alamat: 'Batusangkar',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
