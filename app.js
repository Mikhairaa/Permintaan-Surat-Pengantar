const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const sequelize = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Sync Database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Unable to sync database:', err);
});

// Set up EJS as template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRoutes);
app.use('/mahasiswa', mahasiswaRoutes);
app.use('/', dashboardRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
