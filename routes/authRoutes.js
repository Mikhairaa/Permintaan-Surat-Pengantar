var express = require('express');
var router = express.Router();
const ubahPasswordController = require('../controllers/ubahPasswordController');

router.post('/gantiPassword',ubahPasswordController.ubahPassword)
router.get('/changePass',ubahPasswordController.formUbahPassword)

module.exports = router;