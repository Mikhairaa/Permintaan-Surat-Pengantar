const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mahasiswaController = require('../controllers/mahasiswaController');

router.get('/dashboard', authMiddleware.verifyToken, mahasiswaController.dashboard);
router.get('/profile', authMiddleware.verifyToken, (req, res) => {
    res.render('mahasiswa/profile', { user: req.user });
});
module.exports = router;