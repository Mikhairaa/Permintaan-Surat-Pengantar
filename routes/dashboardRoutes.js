const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Rute dashboard admin
router.get('/admin/dashboard', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  res.render('admin/adminDashboard');
});

// Rute dashboard mahasiswa
router.get('/mahasiswa/dashboard', verifyToken, (req, res) => {
  if (req.user.role !== 'mahasiswa') {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  res.render('mahasiswa/mahasiswaDashboard');
});

module.exports = router;
