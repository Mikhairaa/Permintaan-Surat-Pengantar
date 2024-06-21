const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const userDataMiddleware = require('../middleware/userDataMiddleware');

router.get('/admin/adminDashboard', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.getDashboardData);
router.get('/admin/users', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama, adminController.tampilkanDataMahasiswa);
router.get('/admin/profile', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama, adminController.lihatProfil);
router.get('/admin/riwayat/semua', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.getSemuaRiwayat);
router.get('/admin/riwayat/belumDisetujui', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.tampilkanBelumDisetujui);
router.post('/admin/riwayat/terima/:id',authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama, adminController.terimaSurat);
router.post('/admin/riwayat/tolak/:id', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama, adminController.tolakSurat);
router.get('/admin/riwayat/ditolak', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.tampilkanDitolak);
router.get('/admin/riwayat/dibatalkan', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.tampilkanDibatalkan);
router.get('/admin/riwayat/diproses', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.tampilkanDiproses);
router.post('/admin/riwayat/selesai/:id',authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals, adminController.getNama,adminController.suratSelesai);
router.get('/admin/riwayat/selesai', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.tampilkanSelesai);
router.get('/admin/feedback', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.getFeedbackAdmin);
router.post('/admin/feedback/respon', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals,adminController.getNama,adminController.postFeedbackRespon);
router.post('/admin/uploadFotoProfil', authMiddleware.verifyToken,userDataMiddleware.addUserDataToLocals, adminController.getNama, adminController.uploadFotoProfil);


module.exports = router;