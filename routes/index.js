var express = require('express');
var router = express.Router();

// Route untuk halaman login
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports=router;