const {User} = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

console.log(User);

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Received email:', email);  
  console.log('Received password:', password);  

  if (!email || !password) {
    return res.render('login', { error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found'); 
      return res.render('login', { error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log('Invalid password');  
      return res.render('login', { error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });

    if (user.role === 'admin') {
      return res.redirect('/admin/adminDashboard');
    } else if (user.role === 'mahasiswa') {
      return res.redirect('/mahasiswa/mahasiswaDashboard');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.redirect('/auth/login');
};