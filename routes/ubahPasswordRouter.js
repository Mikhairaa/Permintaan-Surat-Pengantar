var express = require('express');
var router = express.Router();

// GET halaman ubah password
router.get('/', function(req, res, next) {
  res.render('ubahPassword'); // Render halaman ubah password
});

// POST untuk mengubah password
router.post('/', function(req, res, next) {
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var confirmPassword = req.body.confirmPassword;

  // Lakukan validasi, perbandingan, dll. di sini
  if (newPassword !== confirmPassword) {
    res.send('Konfirmasi password baru tidak sesuai');
  } else {
    // Logika untuk mengubah password
    // Misalnya, validasi password lama, simpan password baru ke database, dll.
    res.send('Password berhasil diubah');
  }
});

module.exports = router;
