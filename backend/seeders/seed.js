const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');

const seedAdministrators = require('./Administrator');
const seedRealm = require('./Realm');

connectDB();

const seedDatabase = async () => {
    try {
        console.log('Database seeded');
        await seedAdministrators();
        await seedRealm();
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
    }
};

seedDatabase();