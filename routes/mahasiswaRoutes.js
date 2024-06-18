const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const verifyToken = require ('../middleware/verifyToken')
const mahasiswaController = require('../controllers/mahasiswaController');

router.get('/mahasiswa/mahasiswaDashboard', authMiddleware.verifyToken,mahasiswaController.getDashboardData);
router.get('/mahasiswa/profile', authMiddleware.verifyToken, mahasiswaController.lihatProfil);
router.get('/mahasiswa/permintaan', authMiddleware.verifyToken, mahasiswaController.tampilkanFormulir);
router.post('/mahasiswa/permintaan', authMiddleware.verifyToken, mahasiswaController.createPermintaan);
router.get('/mahasiswa/verifikasi', authMiddleware.verifyToken,mahasiswaController.tampilkanDataVerifikasi);
router.post('/mahasiswa/hapus/:id', authMiddleware.verifyToken,mahasiswaController.hapusData);
router.post('/mahasiswa/edit/:id', authMiddleware.verifyToken, mahasiswaController.editData);
router.get('/mahasiswa/konfirmasi-batal/:id', authMiddleware.verifyToken, mahasiswaController.tampilkanKonfirmasiBatal);
router.get('/mahasiswa/status', authMiddleware.verifyToken,mahasiswaController.getSemuaStatus);
router.get('/mahasiswa/riwayat', authMiddleware.verifyToken,mahasiswaController.getSemuaRiwayat);
//router.get('/mahasiswa/notifikasi', verifyToken, mahasiswaController.getNotifikasi);
//router.post('/mahasiswa/notifikasi/mark-as-read', verifyToken, mahasiswaController.markAsRead);

module.exports = router;