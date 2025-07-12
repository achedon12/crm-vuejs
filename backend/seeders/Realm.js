const Realm = require('../models/Realm');
const User = require("../models/User");

const seedRealm = async () => {
    await Realm.deleteMany({});

    const realms = [
        { name: 'Default Realm', description: 'This is the default realm for the application.' },
    ];

    for (const realmData of realms) {
        const realm = new Realm(realmData);
        await realm.save();
        const adminUser = new User({
            email: 'admin@' + realm.name.replace(/\s+/g, '_').toLowerCase() + '.com',
            username: 'admin_' + realm.name.replace(/\s+/g, '_').toLowerCase(),
            firstname: 'admin',
            lastname: 'admin',
            password: 'admin',
            role: 'admin',
            realm: realm._id,
            state: 'active'
        });
        await adminUser.save();
    }

    console.log('Realms seeded');
}

module.exports = seedRealm;