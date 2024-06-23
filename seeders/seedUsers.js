
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const hashedPasswordAngel = await bcrypt.hash('angel123', 10);
    const hashedPasswordMifta = await bcrypt.hash('mifta123', 10);
    const hashedPasswordDilla = await bcrypt.hash('dilla123', 10);
    const hashedPasswordSusanti = await bcrypt.hash('susanti123', 10);
    const hashedPasswordIsmail = await bcrypt.hash('ismail123', 10);

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
        gender: 'Perempuan',
        status: 'Aktif',
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
        gender: 'Perempuan',
        status: 'Aktif',
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
        gender: 'Perempuan',
        status: 'Aktif',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'susanti999@gmail.com',
        password: hashedPasswordSusanti,
        role: 'mahasiswa',
        nama: 'Susanti',
        no_id: '1811523033',
        alamat: 'Lubuk ALung',
        gender: 'Perempuan',
        status: 'Tidak Aktif',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'ismail404@gmail.com',
        password: hashedPasswordIsmail,
        role: 'mahasiswa',
        nama: 'Ismail',
        no_id: '1911521037',
        alamat: 'Solok',
        gender: 'Laki-Laki',
        status: 'Tidak Aktif',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};