const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

const multer = require('multer');
const upload = multer();

app.use(upload.none());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/Auth'));
app.use('/api/user', require('./routes/User'));
app.use('/api/realm', require('./routes/Realm'));
app.use('/api/task', require('./routes/Task'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

