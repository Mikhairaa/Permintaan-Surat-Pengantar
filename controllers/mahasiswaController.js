const { Op } = require('sequelize');
const { Permintaan, User, Surat }= require('../models');

exports.lihatProfil = async (req, res) => {
  try {
    const id = req.user.id
    console.log("pC", id);
    const lihatProfil = await User.findByPk(id);
    console.log(lihatProfil);
    const userId = lihatProfil.id;
    const userRole = lihatProfil.role;
    const userEmail = lihatProfil.email;
    const userNama = lihatProfil.nama;
    const userNo_Id = lihatProfil.no_id;
    const userAlamat = lihatProfil.alamat;
    const userGender = lihatProfil.gender;
    const userRegistrasi = lihatProfil.createdAt;
    res.render('mahasiswa/profile', {userId, userRole, userEmail, userNama, userNo_Id, userAlamat,userGender, userRegistrasi})
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }  
}

exports.tampilkanDataVerifikasi = async (req, res) => {
  try {
      const mahasiswaId = req.user.id;
      const dataPermintaan = await Permintaan.findAll({
          where: {
              id_user : mahasiswaId,
              status: 'belum disetujui'
          },
          include: [
              { model: Surat,required: true},
              {model: User,required: true}
          ]
      });
      // Render halaman verifikasi dengan data yang telah diambil
      return res.render('mahasiswa/verifikasi', { dataPermintaan });
  } catch (error) {
      // Tangani kesalahan jika terjadi
      console.error(error);
      return res.status(500).send('Terjadi kesalahan saat mengambil data verifikasi');
  }
};

exports.hapusData = async (req, res) => {
  try {
      const { id } = req.params;
      await Permintaan.update({ status: 'dibatalkan' }, { where: { id } });
      res.redirect('/mahasiswa/verifikasi'); // Perbaikan rute
  } catch (error) {
      console.error('Terjadi kesalahan saat mengubah status data:', error);
      res.status(500).send('Terjadi kesalahan saat mengubah status data');
  }
};

exports.tampilkanKonfirmasiBatal = async (req, res) => {
  try {
    const { id } = req.params;
    // Ambil data permintaan yang akan dibatalkan untuk ditampilkan di halaman konfirmasi
    const dataPermintaan = await Permintaan.findByPk(id);
    // Render halaman konfirmasi pembatalan dengan data permintaan
    res.render('mahasiswa/konfirmasiBatal', { dataPermintaan });
  } catch (error) {
    console.error('Terjadi kesalahan saat menampilkan halaman konfirmasi pembatalan:', error);
    res.status(500).send('Terjadi kesalahan saat menampilkan halaman konfirmasi pembatalan');
  }
};

exports.editData = async (req, res) => {
  try {
      const { id } = req.params;
      const { nama_surat, tujuan, deskripsi } = req.body;
      await Permintaan.update({ nama_surat, tujuan, deskripsi }, { where: { id } });
      res.redirect('/mahasiswa/verifikasi');
  } catch (error) {
      console.error('Terjadi kesalahan saat mengedit data:', error);
      res.status(500).send('Terjadi kesalahan saat mengedit data');
  }
};

exports.getDashboardData = async (req, res) => {
  try {
      const mahasiswaId = req.user.id; // Pastikan req.user.id ada dan valid

      const totalSurat = await Permintaan.count({
          where: { id_user: mahasiswaId }
      });

      const suratSelesai = await Permintaan.count({
          where: {
              id_user: mahasiswaId,
              status: 'selesai'
          }
      });

      const suratDalamProses = await Permintaan.count({
          where: {
              id_user: mahasiswaId,
              status: 'dalam proses'
          }
      });

      const suratBelumDisetujui = await Permintaan.count({
          where: {
              id_user: mahasiswaId,
              status: 'belum disetujui'
          }
      });
      const suratDitolak = await Permintaan.count({
        where: {
            id_user: mahasiswaId,
            status: 'ditolak'
        }
      });
      const suratDibatalkan = await Permintaan.count({
      where: {
          id_user: mahasiswaId,
          status: 'dibatalkan'
      }
      });

      res.render('mahasiswa/mahasiswaDashboard', {
          totalSurat,
          suratSelesai,
          suratDalamProses,
          suratBelumDisetujui,
          suratDibatalkan,
          suratDitolak
      });
  } catch (error) {
      console.error(error);
      return res.status(500).send('Terjadi kesalahan saat mengambil data dashboard');
  }
};

exports.tampilkanFormulir = async (req, res) => {
  try {
    res.render('mahasiswa/permintaan');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.createPermintaan = async (req, res) => {
  try {
      const { namaSurat, kodeSurat, tujuan, deskripsi } = req.body;
      const userId = req.user.id;

      // Validasi data
      if (!namaSurat || !kodeSurat || !tujuan || !deskripsi) {
          return res.status(400).json({ success: false, message: 'Semua kolom harus diisi' });
      }

      // Simpan data ke database
      const permintaan = await Permintaan.create({
          kode_surat: kodeSurat,
          id_user: userId,
          status: 'belum disetujui',
          tujuan: tujuan,
          deskripsi: deskripsi
      });

      res.status(201).json({ success: true, message: 'Permintaan berhasil disimpan', data: permintaan });
  } catch (error) {
      console.error('Error saat menyimpan permintaan:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan permintaan' });
  }
};

exports.getSemuaStatus = async (req, res) => {
  try {
      const search = req.query.search || '';
      const filter = req.query.filter || 'terlama';
      let whereClause = {};

      if (search) {
          whereClause = {
              [Op.or]: [
                { '$Surat.kode_surat$': { [Op.like]: `%${search}%` } }, // Pencarian berdasarkan kode surat
                { '$Surat.nama_surat$': { [Op.like]: `%${search}%` } } // Pencarian berdasarkan nama surat
                  // Tambahkan field lain yang ingin dicari
              ]
          };
      }

      let orderClause = [];
      if (filter === 'terbaru') {
          orderClause = [['createdAt', 'DESC']];
      } else {
          orderClause = [['createdAt', 'ASC']];
      }

      const mahasiswaId = req.user.id;
      const status = await Permintaan.findAll({
          where: {
            id_user : mahasiswaId,
            status: ['belum disetujui','dalam proses'],
            ...whereClause
            },
          include: [
            { model: Surat, as: 'Surat' }
          ],
          order: orderClause
      });

      res.render('mahasiswa/status', { status, search, filter });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.getSemuaRiwayat = async (req, res) => {
  try {
      const search = req.query.search || '';
      const filter = req.query.filter || 'terlama';
      let whereClause = {};

      if (search) {
          whereClause = {
              [Op.or]: [
                { '$Surat.kode_surat$': { [Op.like]: `%${search}%` } }, // Pencarian berdasarkan kode surat
                { '$Surat.nama_surat$': { [Op.like]: `%${search}%` } } // Pencarian berdasarkan nama surat
                  // Tambahkan field lain yang ingin dicari
              ]
          };
      }

      let orderClause = [];
      if (filter === 'terbaru') {
          orderClause = [['createdAt', 'DESC']];
      } else {
          orderClause = [['createdAt', 'ASC']];
      }

      const mahasiswaId = req.user.id;
      const riwayat = await Permintaan.findAll({
          where: {
            id_user : mahasiswaId,
            status: ['dibatalkan','ditolak','selesai'],
            ...whereClause
            },
          include: [
            { model: Surat, as: 'Surat' }
          ],
          order: orderClause
      });

      res.render('mahasiswa/riwayat', { riwayat, search, filter });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.getNotifikasi = async (req, res) => {
  try {
      const notifikasi = await Notifikasi.findAll({
          where: { id_user: req.user.id },
          order: [['createdAt', 'DESC']]
      });

      res.render('mahasiswa/notifikasi', { notifikasi });
  } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.markAsRead = async (req, res) => {
  try {
      await Notifikasi.update({ status: 'dibaca' }, {
          where: { id_user: req.user.id, status: 'belum dibaca' }
      });

      res.redirect('/mahasiswa/notifikasi');
  } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).send('Internal Server Error');
  }
};

