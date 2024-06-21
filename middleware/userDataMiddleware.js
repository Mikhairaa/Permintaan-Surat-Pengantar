const { User } = require('../models');

exports.addUserDataToLocals = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      res.locals.user = {
        nama: user.nama,
        no_id: user.no_id,
        email: user.email,
        alamat: user.alamat,
        gender: user.gender,
        registrasi: user.createdAt,
        foto_profil: user.foto_profil,
      };
    }
    next();
  } catch (error) {
    console.error("Error fetching user data: ", error);
    next(error);
  }
};
