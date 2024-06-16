const { Permintaan, User, Surat }= require('../models');

exports.dashboard = (req, res) => {
  res.render('admin/dashboard');
};

exports.lihatProfil = async (req, res) => {
  try {
    const id = req.user.id
    console.log("pC", id);
    const lihatProfil = await User.findByPk(id);
    console.log(lihatProfil);
    const userId = lihatProfil.id;
    const userRole = lihatProfil.role;
    const userEmail = lihatProfil.email;
    const userNama = lihatProfil.nama;
    const userNo_Id = lihatProfil.no_id;
    const userAlamat = lihatProfil.alamat;
    res.render('admin/profile', {userId, userRole, userEmail, userNama, userNo_Id, userAlamat})
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }  
};

exports.tampilkanDataUser = (req, res) => {
  res.render('admin/users');
};

