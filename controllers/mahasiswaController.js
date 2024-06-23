const { Op } = require('sequelize');
const { Permintaan, User, Surat, Notifikasi, Feedback }= require('../models');
const upload = require('../middleware/uploadMiddleware');
const PDFDocument = require('pdfkit');
const path = require ('path');

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
};

exports.getDashboardData = async (req, res) => {
  try {
      const mahasiswaId = req.user.id; // Pastikan req.user.id ada dan valid

      const totalSurat = await Permintaan.count({ where: { id_user: mahasiswaId } });
        const suratSelesai = await Permintaan.count({ where: { id_user: mahasiswaId, status: 'selesai' } });
        const suratDalamProses = await Permintaan.count({ where: { id_user: mahasiswaId, status: 'dalam proses' } });
        const suratBelumDisetujui = await Permintaan.count({ where: { id_user: mahasiswaId, status: 'belum disetujui' } });
        const suratDitolak = await Permintaan.count({ where: { id_user: mahasiswaId, status: 'ditolak' } });
        const suratDibatalkan = await Permintaan.count({ where: { id_user: mahasiswaId, status: 'dibatalkan' } });

      res.render('mahasiswa/mahasiswaDashboard', {
          namaMahasiswa: res.locals.namaMahasiswa,
          noIdMahasiswa: res.locals.noIdMahasiswa,  
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

exports.createPermintaan = async (req, res) => {
  try {
      const { namaSurat, kodeSurat, tujuan, deskripsi } = req.body;
      const userId = req.user.id;

      if (!namaSurat || !kodeSurat || !tujuan || !deskripsi) {
          return res.status(400).json({ success: false, message: 'Semua kolom harus diisi' });
      }


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

exports.tampilkanFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      include: {
          model: User,as:'User',
          attributes: ['nama'] 
      }
    });
      res.render('mahasiswa/feedback', { feedback});
  } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat mengambil data feedback');
  }
};

exports.tampilkanFormFeedback = async (req, res) => {
  try {
      res.render('mahasiswa/tulisFeedback');
  } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat memuat halaman tulis feedback');
  }
};

exports.kirimFeedback = async (req, res) => {
  try {
      const { ulasan, penilaian } = req.body;
      const mahasiswaId = req.user.id;  
     
      const feedback = await Feedback.create({
          id_user: mahasiswaId,
          ulasan :ulasan,
          penilaian: penilaian,
          respon: "", 
      });

      res.render('mahasiswa/tulisFeedback', { successMessage: 'Feedback berhasil dikirim!', data: feedback});
  } catch (error) {
      console.error(error);
      res.render('mahasiswa/tulisFeedback', {
          errorMessage: 'Terjadi kesalahan saat mengirim feedback.',
      });
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
          res.redirect('/mahasiswa/profile',);
        } catch (error) {
          console.error("Error uploading file: ", error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    }
  });
};

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
      // Render halaman verifikasi dengan data yang telah diambil
      return res.render('mahasiswa/verifikasi', { dataPermintaan });
  } catch (error) {
      // Tangani kesalahan jika terjadi
      console.error(error);
      return res.status(500).send('Terjadi kesalahan saat mengambil data verifikasi');
  }
};

exports.markAsRead = async (req, res) => {
  try {
      await Notifikasi.update({ status_notifikasi: 'dibaca' }, {
          where: { id_user: req.user.id, status_notifikasi: 'belum dibaca' }
      });

      // Menggunakan res.json sebagai respons agar sesuai dengan fetch request di sisi klien
      res.json({ message: 'All notifications marked as read' });
  } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.getNamaMahasiswa = async (req, res, next) => {
  try {
      const userId = req.user.id; // Ganti dengan cara yang sesuai untuk mendapatkan ID pengguna mahasiswa
      const user = await User.findOne({ where: { id: userId } }); // Ganti dengan cara yang sesuai untuk menemukan pengguna
      const namaMahasiswa = user.nama;
      const noIdMahasiswa = user.no_id; // Ganti 'nama' dengan nama kolom yang sesuai di tabel users
      
      // Menyimpan nama pengguna ke dalam objek locals
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

exports.generatePDF = (req, res) => {
  try {
    const { nama, nim, email, namaSurat, kodeSurat, tujuan, deskripsi } = req.query;
    const doc = new PDFDocument();

   
    res.setHeader('Content-disposition', 'attachment; filename=formulir.pdf');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.moveDown(2);

    const logoPath = path.join(__dirname, 'logounand.png');
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.image(logoPath, pageWidth / 4, pageHeight / 4, {
      fit: [pageWidth / 2, pageHeight / 2],
      opacity: 0.1 // Adjust opacity as needed to make the image appear faded
    });


    doc.font('Times-Roman').fontSize(14).text('FORMULIR PERMINTAAN SURAT PENGANTAR', {
      align: 'center',
      bold: true
    });
    doc.font('Times-Roman').fontSize(14).text('DEPARTEMEN SISTEM INFORMASI', {
      align: 'center',
      bold: true
    });
    doc.font('Times-Roman').fontSize(14).text('FAKULTAS TEKNOLOGI INFORMASI', {
      align: 'center',
      bold: true
    });
    doc.moveDown(2);

   
    doc.font('Times-Roman').fontSize(12).text('A. IDENTITAS MAHASISWA', {
      bold: true
    });
    doc.moveDown();

    const formData = [
      { label: 'Nama', value: nama },
      { label: 'NIM', value: nim },
      { label: 'Email', value: email }
    ];

    formData.forEach(item => {
      doc.text(`${item.label.padEnd(20, ' ')}: ${item.value}`);
    });

    doc.moveDown(2);

    doc.font('Times-Roman').fontSize(12).text('B. PERMINTAAN SURAT PENGANTAR', {
      bold: true
    });
    doc.moveDown();

    const suratData = [
      { label: 'Nama Surat', value: namaSurat },
      { label: 'Kode Surat', value: kodeSurat },
      { label: 'Tujuan Surat', value: tujuan },
      { label: 'Deskripsi', value: deskripsi },
      { label: 'Tanggal Pengajuan', value: new Date().toLocaleDateString() }
    ];

    suratData.forEach(item => {
      doc.text(`${item.label.padEnd(20, ' ')}: ${item.value}`);
    });

    doc.moveDown(4);
    doc.fontSize(10).text('*Harap dibawa saat mengambil surat', {
      align: 'left',
      lineGap: 1.5,
      baseline: 'bottom'
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};