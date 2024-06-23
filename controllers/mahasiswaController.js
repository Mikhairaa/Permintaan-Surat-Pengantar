const { Op } = require('sequelize');
const { Permintaan, User, Surat, Notifikasi, Feedback }= require('../models');
const upload = require('../middleware/uploadMiddleware');
const PDFDocument = require('pdfkit');

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
    const userFotoProfil = lihatProfil.foto_profil;
    res.render('mahasiswa/profile', {userId, userRole, userEmail, userNama, userNo_Id, userAlamat,userGender, userRegistrasi,userFotoProfil})
    
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
              { model: Surat, as:'Surat',required: true},
              {model: User,as:'User',required: true}
          ]
      });
      return res.render('mahasiswa/verifikasi', { dataPermintaan });
  } catch (error) {
      console.error(error);
      return res.status(500).send('Terjadi kesalahan saat mengambil data verifikasi');
  }
};

exports.hapusData = async (req, res) => {
  try {
      const { id } = req.params;
      await Permintaan.update({ status: 'dibatalkan' }, { where: { id } });
      res.redirect('/mahasiswa/verifikasi'); 
  } catch (error) {
      console.error('Terjadi kesalahan saat mengubah status data:', error);
      res.status(500).send('Terjadi kesalahan saat mengubah status data');
  }
};

exports.tampilkanKonfirmasiBatal = async (req, res) => {
  try {
    const { id } = req.params;
    const dataPermintaan = await Permintaan.findByPk(id);
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

exports.getNotifikasi = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;  
    const notifikasi = await Notifikasi.findAll({
          where: { id_user: mahasiswaId},
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
      await Notifikasi.update({ status_notifikasi: 'dibaca' }, {
          where: { id_user: req.user.id, status_notifikasi: 'belum dibaca' }
      });


      res.json({ message: 'All notifications marked as read' });
  } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.getNamaMahasiswa = async (req, res, next) => {
  try {
      const userId = req.user.id; 
      const user = await User.findOne({ where: { id: userId } }); 
      const namaMahasiswa = user.nama;
      const noIdMahasiswa = user.no_id; 
      
      res.locals.namaMahasiswa = namaMahasiswa;
      res.locals.noIdMahasiswa = noIdMahasiswa;
      console.log('Nama mahasiswa:', namaMahasiswa);
      console.log('Nomor ID mahasiswa:', noIdMahasiswa);
      next();
  } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat memuat data mahasiswa');
  }
};

