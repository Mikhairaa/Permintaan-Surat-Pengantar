const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Received email:', email);  // Logging untuk debug
  console.log('Received password:', password);  // Logging untuk debug

  if (!email || !password) {
    return res.render('login', { error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found');  // Logging untuk debug
      return res.render('login', { error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log('Invalid password');  // Logging untuk debug
      return res.render('login', { error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else if (user.role === 'mahasiswa') {
      return res.redirect('/mahasiswa/dashboard');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
