const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ubahPasswordController = require('../controllers/ubahPasswordController');
const verifyToken = require ('../middleware/verifyToken')

router.get('/login', (req, res) => {
  res.render('login', { error: '' });
});

router.post('/login', authController.login);
router.post('/gantiPassword',verifyToken,ubahPasswordController.ubahPassword)
router.get('/changePass',verifyToken,ubahPasswordController.formUbahPassword)
module.exports = router;

