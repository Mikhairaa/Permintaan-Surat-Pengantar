const { Op } = require('sequelize');
const { Permintaan, User, Surat, Notifikasi, Feedback}= require('../models');
const upload = require('../middleware/uploadMiddleware');

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

