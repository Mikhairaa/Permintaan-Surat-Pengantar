const { Permintaan, User, Surat }= require('../models');

exports.dashboard = async (req, res) => {
  try {
    const id = req.user.id
    // Panggil fungsi untuk melihat profil pengguna
    const lihatProfil = await User.findByPk(id);
    // Ambil data nama pengguna dari hasil pemanggilan fungsi
    const userNama = lihatProfil.nama;
    console.log("UserNama:", userNama);

    // Kemudian Anda dapat merender halaman 'mahasiswaDashboard.ejs' dengan menyertakan nama pengguna
    res.render('mahasiswa/dashboard', { userNama });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
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

exports.tampilkanDataVerifikasi = async (req, res) => {
  try {
      // Mengambil data permintaan dari database yang statusnya belum disetujui
      const dataPermintaan = await Permintaan.findAll({
          where: {
              status: 'belum disetujui'
          },
          include: [
              { model: Surat,required: true},
              {model: User,required: true}
          ]
      });
      // Jika tidak ada data yang ditemukan
      if (!dataPermintaan || dataPermintaan.length === 0) {
          return res.render('mahasiswa/verifikasi', { errorMessage: "Tidak ada data verifikasi yang tersedia" });
      }

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
    await Permintaan.destroy({ where: { id } });
    res.redirect('/mahasiswa/verifikasi'); // Perbaikan rute
  } catch (error) {
    console.error('Terjadi kesalahan saat menghapus data:', error);
    res.status(500).send('Terjadi kesalahan saat menghapus data');
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

exports.tampilkanFormEdit = async (req, res) => {
  try {
      const { id } = req.params;
      const data = await Permintaan.findOne({ where: { id } });
      res.render('mahasiswa/formEdit', { data });
  } catch (error) {
      console.error('Terjadi kesalahan saat menampilkan form edit:', error);
      res.status(500).send('Terjadi kesalahan saat menampilkan form edit');
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





