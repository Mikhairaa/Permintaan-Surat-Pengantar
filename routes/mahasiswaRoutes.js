const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mahasiswaController = require('../controllers/mahasiswaController');

router.get('/dashboard', authMiddleware.verifyToken, mahasiswaController.dashboard);

module.exports = router;
