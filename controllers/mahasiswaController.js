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

exports.generatePDF = (req, res) => {
  try {
    const { nama, nim, email, namaSurat, kodeSurat, tujuan, deskripsi } = req.query;
    const doc = new PDFDocument();

    
    res.setHeader('Content-disposition', 'attachment; filename=formulir.pdf');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.moveDown(2);

   
    doc.font('Times-Roman').fontSize(16).text('FORMULIR PERMINTAAN SURAT PENGANTAR', {
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