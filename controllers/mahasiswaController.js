// controllers/mahasiswaController.js

const User = require('../models/user');

// controllers/mahasiswaController.js

exports.dashboard = (req, res) => {
  res.render('mahasiswa/Dashboard');
};

exports.profile = (req, res) => {
  res.render('mahasiswa/profile', { user: req.user });
};