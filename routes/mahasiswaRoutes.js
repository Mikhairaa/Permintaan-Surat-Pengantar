const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mahasiswaController = require('../controllers/mahasiswaController');
const userDataMiddleware = require('../middleware/userDataMiddleware');

router.get('/mahasiswa/mahasiswaDashboard', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.getDashboardData);
router.get('/mahasiswa/profile', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.lihatProfil);
router.get('/mahasiswa/permintaan', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.tampilkanFormulir);
router.post('/mahasiswa/permintaan', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.createPermintaan);
router.get('/mahasiswa/verifikasi', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.tampilkanDataVerifikasi);
router.post('/mahasiswa/hapus/:id', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.hapusData);
router.post('/mahasiswa/edit/:id', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.editData);
router.get('/mahasiswa/konfirmasi-batal/:id', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.tampilkanKonfirmasiBatal);
router.get('/mahasiswa/status', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.getSemuaStatus);
router.get('/mahasiswa/riwayat', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.getSemuaRiwayat);
router.get('/mahasiswa/notifikasi', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.getNotifikasi);
router.post('/mahasiswa/notifikasi/mark-as-read', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.markAsRead);
router.get('/mahasiswa/feedback', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.tampilkanFeedback);
router.get('/mahasiswa/tulis-feedback', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.tampilkanFormFeedback);
router.post('/mahasiswa/kirim-feedback', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.getNamaMahasiswa, mahasiswaController.kirimFeedback);
router.post('/mahasiswa/uploadFotoProfil', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.uploadFotoProfil);
router.get('/mahasiswa/generate-pdf', authMiddleware.verifyToken, userDataMiddleware.addUserDataToLocals, mahasiswaController.generatePDF);

module.exports = router;