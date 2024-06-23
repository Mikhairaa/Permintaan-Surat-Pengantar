const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const sequelize = require('./config/db');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Unable to sync database:', err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views','public')));
app.use('/auth', authRoutes);
app.use('/', adminRoutes);
app.use('/', mahasiswaRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});