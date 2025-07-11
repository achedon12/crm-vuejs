const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');

const seedAdministrators = require('./Administrator');

connectDB();

const seedDatabase = async () => {
    try {
        console.log('Database seeded');
        await seedAdministrators();
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
    }
};

seedDatabase();