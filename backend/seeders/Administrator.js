const bcrypt = require('bcrypt');
const Administrator = require('../models/Administrator');


const seedUsers = async () => {
    await Administrator.deleteMany({});

    const admin = new Administrator({
        email: 'admin@gmail.com',
        username: 'admin',
        firstname: 'admin',
        lastname: 'admin',
        password: 'admin',
    });

    admin.password = await bcrypt.hash('admin', 10);
    await admin.save();

    console.log('Administrator seeded');
}

module.exports = seedUsers;