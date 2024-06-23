const { Op } = require('sequelize');
const { Permintaan, User, Surat, Notifikasi, Feedback}= require('../models');
const upload = require('../middleware/uploadMiddleware');

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
    const userFotoProfil = lihatProfil.foto_profil;
    res.render('admin/profile', {userId, userRole, userEmail, userNama, userNo_Id, userAlamat, userFotoProfil})
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }  
};

exports.uploadFotoProfil = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ message: 'No file selected!' });
      } else {
        try {
          const id = req.user.id;
          await User.update({ foto_profil: req.file.filename }, { where: { id: id } });
          res.redirect('/admin/profile');
        } catch (error) {
          console.error("Error uploading file: ", error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    }
  });
};
exports.getSemuaRiwayat = async (req, res) => {
  try {
      const search = req.query.search || '';
      const filter = req.query.filter || 'terlama';
      let whereClause = {};

      if (search) {
          whereClause = {
              [Op.or]: [
                  { '$User.nama$': { [Op.like]: `%${search}%` } }, 
                  { '$User.no_id$': { [Op.like]: `%${search}%` } }, 
                  { '$Surat.kode_surat$': { [Op.like]: `%${search}%` } }, 
                  { '$Surat.nama_surat$': { [Op.like]: `%${search}%` } } 

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
   
    const belumDisetujui = await Permintaan.findAll({
      where: {
        status: 'belum disetujui'
        },
      include: [
        {
          model: User,
          as:'User',
          where: { role: 'mahasiswa' }, 
          attributes: ['nama', 'no_id'] 
        },
        {
          model: Surat,
          as:'Surat',
          attributes: ['nama_surat','kode_surat'] 
        }
      ],
      order: [['createdAt', 'ASC']] 
    });
res.render('admin/belumDisetujui', { belumDisetujui});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
};

exports.tampilkanDitolak = async (req, res) => {
  try {
    
    const ditolak = await Permintaan.findAll({
      where: {
        status: 'ditolak'
        },
      include: [
        {
          model: User,
          as:'User',
          where: { role: 'mahasiswa' },
          attributes: ['nama', 'no_id'] 
        },
        {
          model: Surat,
          as:'Surat',
          attributes: ['nama_surat','kode_surat'] 
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
    
    const dibatalkan = await Permintaan.findAll({
      where: {
        status: 'dibatalkan'
        },
      include: [
        {
          model: User,
          as:'User',
          where: { role: 'mahasiswa' }, 
          attributes: ['nama', 'no_id'] 
        },
        {
          model: Surat,
          as:'Surat',
          attributes: ['nama_surat','kode_surat'] 
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

exports.tampilkanSelesai = async (req, res) => {
  try {
    
    const selesai = await Permintaan.findAll({
      where: {
        status: 'selesai'
        },
      include: [
        {
          model: User,
          as:'User',
          where: { role: 'mahasiswa' }, 
          attributes: ['nama', 'no_id'] 
        },
        {
          model: Surat,
          as:'Surat',
          attributes: ['nama_surat','kode_surat'] 
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
          namaAdmin: res.locals.namaAdmin,
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

exports.getFeedbackAdmin = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({ 
      include: { 
          model: User, 
          as: 'User' 
      } 
  });
      res.render('admin/feedbackAdmin', { feedback });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

exports.postFeedbackRespon = async (req, res) => {
  const { feedbackId, respon } = req.body;

  try {
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).send('Feedback not found');
    }

    feedback.respon = respon;
    await feedback.save();

    req.successMessage = 'Response sent successfully!';
    res.redirect('/admin/feedback');
  } catch (err) {
    console.error(err);
    req.errorMessage = 'Failed to send response';
    res.redirect('/admin/feedback');
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
          as:'User',
          where: { role: 'mahasiswa' }, // Filter hanya role mahasiswa
          attributes: ['nama', 'no_id'] // Ambil nama dan nim mahasiswa
        },
        {
          model: Surat,
          as:'Surat',
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

      // Cari permintaan yang akan diubah statusnya
      const permintaan = await Permintaan.findOne({
          where: { id },
          include: { model: Surat, as: 'Surat' }
      });

      if (!permintaan) {
          return res.status(404).send('Permintaan tidak ditemukan');
      }

      // Update status permintaan
      await Permintaan.update({ status: 'selesai' }, { where: { id } });

      // Membuat notifikasi untuk mahasiswa
      const deskripsi = `${permintaan.Surat.nama_surat} untuk ${permintaan.tujuan} telah selesai, silahkan ambil surat ke administrasi departemen Sistem Informasi`;

      await Notifikasi.create({
          id_user: permintaan.id_user,
          judul_notifikasi: 'Surat Anda Telah Selesai',
          deskripsi_notifikasi: deskripsi
      });

      res.redirect('/admin/riwayat/diproses');
  } catch (error) {
      console.error('Terjadi kesalahan saat mengubah status data:', error);
      res.status(500).send('Terjadi kesalahan saat mengubah status data');
  }
};

exports.getNama = async (req, res, next) => {
  try {
      const userId = req.user.id; // Ganti dengan cara yang sesuai untuk mendapatkan ID pengguna mahasiswa
      const user = await User.findOne({ where: { id: userId } }); // Ganti dengan cara yang sesuai untuk menemukan pengguna
      const namaAdmin = user.nama;
      res.locals.namaAdmin = namaAdmin;
      next();
  } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat memuat data admin');
  }
};


