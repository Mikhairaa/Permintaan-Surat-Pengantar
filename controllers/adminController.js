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
    res.render('admin/profile', {userId, userRole, userEmail, userNama, userNo_Id, userAlamat})
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }  
};

exports.tampilkanDataMahasiswa = async (req, res) => {
  try {
    const dataMahasiswa = await User.findAll({
      where: {
        role: 'mahasiswa'
      }
    });
    // Jika tidak ada data yang ditemukan
    if (!dataMahasiswa || dataMahasiswa.length === 0) {
      return res.render('admin/users', { errorMessage: "Tidak ada data mahasiswa yang tersedia", dataMahasiswa: [] });
    }

    // Render halaman users dengan data mahasiswa yang telah diambil
    return res.render('admin/users', { dataMahasiswa });
  } catch (error) {
    // Tangani kesalahan jika terjadi
    console.error(error);
    return res.status(500).send('Terjadi kesalahan saat mengambil data mahasiswa');
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
                  { '$User.nama$': { [Op.like]: `%${search}%` } }, // Pencarian berdasarkan nama pengguna
                  { '$User.no_id$': { [Op.like]: `%${search}%` } }, // Pencarian berdasarkan NIM pengguna
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

      const semuaPermintaan = await Permintaan.findAll({
          where: whereClause,
          include: [
              { model: User, as: 'User' },
              { model: Surat, as: 'Surat' }
          ],
          order: orderClause
      });

      res.render('admin/semuaSurat', { semuaPermintaan, search, filter });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
  }
};
exports.tampilkanBelumDisetujui = async (req, res) => {
  try {
    // Ambil semua permintaan surat dari mahasiswa
    const belumDisetujui = await Permintaan.findAll({
      where: {
        status: 'belum disetujui'
        },
      include: [
        {
          model: User,
          where: { role: 'mahasiswa' }, // Filter hanya role mahasiswa
          attributes: ['nama', 'no_id'] // Ambil nama dan nim mahasiswa
        },
        {
          model: Surat,
          attributes: ['nama_surat','kode_surat'] // Ambil nama surat
        }
      ],
      order: [['createdAt', 'ASC']] // Urutkan berdasarkan tanggal pembuatan dari yang terlama
    });
res.render('admin/belumDisetujui', { belumDisetujui});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
};

exports.terimaSurat = async (req, res) => {
  try {
      const { id } = req.params;
      await Permintaan.update({ status: 'dalam proses' }, { where: { id } });
      res.redirect('/admin/riwayat/belumDisetujui');
  } catch (error) {
      console.error('Terjadi kesalahan saat mengubah status data:', error);
      res.status(500).send('Terjadi kesalahan saat mengubah status data');
  }
};

exports.tolakSurat = async (req, res) => {
  try {
      const { id } = req.params;
      const { keterangan } = req.body;
      await Permintaan.update({ status: 'ditolak', keterangan: keterangan }, { where: { id } });
      res.redirect('/admin/riwayat/belumDisetujui');
  } catch (error) {
      console.error('Terjadi kesalahan saat mengubah status data:', error);
      res.status(500).send('Terjadi kesalahan saat mengubah status data');
  }
};

exports.tampilkanDitolak = async (req, res) => {
  try {
    // Ambil semua permintaan surat dari mahasiswa
    const ditolak = await Permintaan.findAll({
      where: {
        status: 'ditolak'
        },
      include: [
        {
          model: User,
          where: { role: 'mahasiswa' }, // Filter hanya role mahasiswa
          attributes: ['nama', 'no_id'] // Ambil nama dan nim mahasiswa
        },
        {
          model: Surat,
          attributes: ['nama_surat','kode_surat'] // Ambil nama surat
        }
      ],
      order: [['createdAt', 'ASC']]

    });

    res.render('admin/ditolak', { ditolak});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
};

exports.tampilkanDibatalkan = async (req, res) => {
  try {
    // Ambil semua permintaan surat dari mahasiswa
    const dibatalkan = await Permintaan.findAll({
      where: {
        status: 'dibatalkan'
        },
      include: [
        {
          model: User,
          where: { role: 'mahasiswa' }, // Filter hanya role mahasiswa
          attributes: ['nama', 'no_id'] // Ambil nama dan nim mahasiswa
        },
        {
          model: Surat,
          attributes: ['nama_surat','kode_surat'] // Ambil nama surat
        }
      ],
      order: [['createdAt', 'ASC']]

    });

    res.render('admin/dibatalkan', { dibatalkan});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
};

exports.tampilkanDiproses = async (req, res) => {
  try {
    // Ambil semua permintaan surat dari mahasiswa
    const diproses = await Permintaan.findAll({
      where: {
        status: 'dalam proses'
        },
      include: [
        {
          model: User,
          where: { role: 'mahasiswa' }, // Filter hanya role mahasiswa
          attributes: ['nama', 'no_id'] // Ambil nama dan nim mahasiswa
        },
        {
          model: Surat,
          attributes: ['nama_surat','kode_surat'] // Ambil nama surat
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.render('admin/diproses', { diproses});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
};

exports.suratSelesai = async (req, res) => {
  try {
      const { id } = req.params;
      await Permintaan.update({ status: 'selesai' }, { where: { id } });
      res.redirect('/admin/riwayat/diproses');
  } catch (error) {
      console.error('Terjadi kesalahan saat mengubah status data:', error);
      res.status(500).send('Terjadi kesalahan saat mengubah status data');
  }
};

exports.tampilkanSelesai = async (req, res) => {
  try {
    // Ambil semua permintaan surat dari mahasiswa
    const selesai = await Permintaan.findAll({
      where: {
        status: 'selesai'
        },
      include: [
        {
          model: User,
          where: { role: 'mahasiswa' }, // Filter hanya role mahasiswa
          attributes: ['nama', 'no_id'] // Ambil nama dan nim mahasiswa
        },
        {
          model: Surat,
          attributes: ['nama_surat','kode_surat'] // Ambil nama surat
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.render('admin/selesai', { selesai});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
};

exports.getDashboardData = async (req, res) => {
  try {
      const totalSurat = await Permintaan.count();
      const suratSelesai = await Permintaan.count({ where: { status: 'selesai' } });
      const suratDalamProses = await Permintaan.count({ where: { status: 'dalam proses' } });
      const suratBelumDisetujui = await Permintaan.count({ where: { status: 'belum disetujui' } });
      const suratDitolak = await Permintaan.count({ where: { status: 'ditolak' } });
      const suratDibatalkan = await Permintaan.count({ where: { status: 'dibatalkan' } });

      res.render('admin/adminDashboard', {
          totalSurat,
          suratSelesai,
          suratDalamProses,
          suratBelumDisetujui,
          suratDibatalkan,
          suratDitolak
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};

