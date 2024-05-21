// Import module yang diperlukan
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: true }));

// Set view engine
app.set('view engine', 'ejs');

// Dummy database
const users = {
    'user1': { password: 'password123' },
    // tambahkan user lain di sini
};

// Rute untuk menampilkan form ubah password
app.get('/ubahPassword', (req, res) => {
    res.render('ubahPassword');
});

// Rute untuk memproses perubahan password
app.post('/ubahPassword', (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    // Periksa apakah password saat ini sesuai dengan yang ada di database
    if (users[username] && users[username].password === currentPassword) {
        // Jika sesuai, ubah password dengan yang baru
        users[username].password = newPassword;
        res.send('Password berhasil diubah');
    } else {
        // Jika tidak sesuai, kirim pesan kesalahan
        res.send('Password saat ini salah');
    }
});

// Export app
module.exports = app;
