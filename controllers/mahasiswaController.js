const Permintaan = require('../models/permintaan');
const { User }= require('../models');

exports.dashboard = (req, res) => {
  res.render('mahasiswa/dashboard');
}

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
    res.render('mahasiswa/profile', {userId, userRole, userEmail, userNama, userNo_Id, userAlamat})
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
}
exports.verifikasi = (req, res) => {
  res.render('mahasiswa/verifikasi');
}

exports.tampilkanFormulir = async (req, res) => {
  try {

    res.render('mahasiswa/permintaan');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.kirimFormulir = async (req, res) => {
  try {
    const { deskripsi, tujuan } = req.body;

   // Memasukkan data formulir ke dalam basis data menggunakan model Formulir
    await Permintaan.create({ 
      deskripsi: deskripsi,
      tujuan: tujuan,
      id_users:req.userId,
      tanggal_pengajuan: new Date()
    });

    return res.render('mahasiswa/kirimFormulir', { successMessage: "Formulir berhasil dikirim!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
};