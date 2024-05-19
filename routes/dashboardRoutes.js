const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const adminController = require('../controllers/adminController');
const mahasiswaController = require('../controllers/mahasiswaController');

// Rute dashboard admin
router.get('/admin/dashboard', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).render('error', { message: 'Access denied' });
    }
    adminController.dashboard(req, res);
});

// Rute profil admin
router.get('/admin/profile', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).render('error', { message: 'Access denied' });
    }
    res.render('admin/profile', { user: req.user });
});

// Rute dashboard mahasiswa
router.get('/mahasiswa/dashboard', verifyToken, (req, res) => {
    if (req.user.role !== 'mahasiswa') {
        return res.status(403).render('error', { message: 'Access denied' });
    }
    mahasiswaController.dashboard(req, res);
});

// Rute profil mahasiswa
router.get('/mahasiswa/profile', verifyToken, (req, res) => {
  if (req.user.role !== 'mahasiswa') {
      return res.status(403).render('error', { message: 'Access denied' });
  }
  res.render('mahasiswa/profile', { user: req.user });
});

module.exports = router;
