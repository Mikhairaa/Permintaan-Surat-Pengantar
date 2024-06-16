const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const verifyToken = require ('../middleware/verifyToken')
const adminController = require('../controllers/adminController');

// Rute dashboard admin
router.get('/admin/dashboard', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  res.render('admin/adminDashboard');
});

router.get('/admin/users', authMiddleware.verifyToken,adminController.tampilkanDataUser);
module.exports = router;