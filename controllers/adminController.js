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
exports.tampilkanDataMahasiswa = async (req, res) => {
  try {
    const dataMahasiswa = await User.findAll({
      where: {
        role: 'mahasiswa'
      }
    });

    if (!dataMahasiswa || dataMahasiswa.length === 0) {
      return res.render('admin/users', { errorMessage: "Tidak ada data mahasiswa yang tersedia", dataMahasiswa: [] });
    }


    return res.render('admin/users', { dataMahasiswa });
  } catch (error) {
    
    console.error(error);
    return res.status(500).send('Terjadi kesalahan saat mengambil data mahasiswa');
  }
};

exports.tampilkanDiproses = async (req, res) => {
  try {
    
    const diproses = await Permintaan.findAll({
      where: {
        status: 'dalam proses'
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

    res.render('admin/diproses', { diproses});
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat data');
  }
};

exports.suratSelesai = async (req, res) => {
  try {
      const { id } = req.params;

      
      const permintaan = await Permintaan.findOne({
          where: { id },
          include: { model: Surat, as: 'Surat' }
      });

      if (!permintaan) {
          return res.status(404).send('Permintaan tidak ditemukan');
      }

      
      await Permintaan.update({ status: 'selesai' }, { where: { id } });

      
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
      const userId = req.user.id; 
      const user = await User.findOne({ where: { id: userId } }); 
      const namaAdmin = user.nama;
      res.locals.namaAdmin = namaAdmin;
      next();
  } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat memuat data admin');
  }
};



