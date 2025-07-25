const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/Auth'));
app.use('/api/user', require('./routes/User'));
app.use('/api/realm', require('./routes/Realm'));
app.use('/api/task', require('./routes/Task'));
app.use('/api/notification', require('./routes/Notification'));
app.use('/api/file', require('./routes/File'));
app.use('/api/comment', require('./routes/Comment'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

