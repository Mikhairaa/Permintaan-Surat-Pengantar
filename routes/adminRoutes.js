const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const verifyToken = require ('../middleware/verifyToken')
const adminController = require('../controllers/adminController');

// Rute dashboard admin
router.get('/admin/adminDashboard', authMiddleware.verifyToken,adminController.getDashboardData);
router.get('/admin/users', authMiddleware.verifyToken, adminController.tampilkanDataMahasiswa);
router.get('/admin/profile', authMiddleware.verifyToken, adminController.lihatProfil);
//router.get('/admin/riwayat/semua', authMiddleware.verifyToken,adminController.tampilkanSemuaPermintaan);
router.get('/admin/riwayat/semua', authMiddleware.verifyToken,adminController.getSemuaRiwayat);
router.get('/admin/riwayat/belumDisetujui', authMiddleware.verifyToken,adminController.tampilkanBelumDisetujui);
router.post('/admin/riwayat/terima/:id',authMiddleware.verifyToken, adminController.terimaSurat);
router.post('/admin/riwayat/tolak/:id', authMiddleware.verifyToken, adminController.tolakSurat);
router.get('/admin/riwayat/ditolak', authMiddleware.verifyToken,adminController.tampilkanDitolak);
router.get('/admin/riwayat/dibatalkan', authMiddleware.verifyToken,adminController.tampilkanDibatalkan);
router.get('/admin/riwayat/diproses', authMiddleware.verifyToken,adminController.tampilkanDiproses);
router.post('/admin/riwayat/selesai/:id',authMiddleware.verifyToken, adminController.suratSelesai);
router.get('/admin/riwayat/selesai', authMiddleware.verifyToken,adminController.tampilkanSelesai);
//router.get('/admin/dashboard', authMiddleware.verifyToken,adminController.getDashboardData);

module.exports = router;