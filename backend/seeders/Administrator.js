const bcrypt = require('bcrypt');
const Administrator = require('../models/Administrator');


const seedUsers = async () => {
    await Administrator.deleteMany({});


    // adminUser
    const adminUser = new Administrator({
        email: 'admin@gmail.com',
        firstname: 'admin',
        lastname: 'admin',
        password: 'admin',
    });

    adminUser.password = await bcrypt.hash('admin', 10);
    await adminUser.save();

    console.log('Users seeded');
}

module.exports = seedUsers;