const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require ('../middleware/verifyToken')

// Rute dashboard admin
router.get('/admin/dashboard', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).render('error', { message: 'Access denied' }); 
  }
  res.render('admin/adminDashboard');
});

module.exports = router;