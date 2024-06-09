const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const verifyToken = require ('../middleware/verifyToken')
const mahasiswaController = require('../controllers/mahasiswaController');

// Rute dashboard mahasiswa
router.get('/mahasiswa/dashboard', verifyToken, (req, res) => {
    if (req.user.role !== 'mahasiswa') {
      return res.status(403).render('error', { message: 'Access denied' });
    }
    res.render('mahasiswa/mahasiswaDashboard');
  });
  
router.get('/mahasiswa/dashboard', authMiddleware.verifyToken,mahasiswaController.dashboard);
router.get('/mahasiswa/profile', authMiddleware.verifyToken, mahasiswaController.lihatProfil);
router.get('/mahasiswa/verifikasi', authMiddleware.verifyToken,mahasiswaController.verifikasi);
router.get('/mahasiswa/permintaan', authMiddleware.verifyToken,mahasiswaController.tampilkanFormulir);


module.exports = router;