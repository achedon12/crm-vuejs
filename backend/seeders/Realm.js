const Realm = require('../models/Realm');
const User = require("../models/User");
const Task = require('../models/Task');
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");

const seedRealm = async () => {
    await Realm.deleteMany({});
    await User.deleteMany({});
    await Task.deleteMany({});

    const realms = [
        { name: 'Default Realm', description: 'Ceci est le realm par défaut.' },
        { name: 'Test Realm', description: 'Ceci est un realm de test.' }
    ];

    for (const realmData of realms) {
        const realm = new Realm(realmData);
        await realm.save();

        const adminUser = new User({
            email: `default_admin_${realm.name.replace(/\s+/g, '_').toLowerCase()}@default.com`,
            username: `default_admin_${realm.name.replace(/\s+/g, '_').toLowerCase()}`,
            firstname: 'default',
            lastname: 'admin',
            password: await bcrypt.hash('admin', 10),
            role: 'admin',
            realm: realm._id,
            state: 'active'
        });
        await adminUser.save();

        for (let i = 1; i <= 3; i++) {
            const firstname = faker.person.firstName();
            const lastname = faker.person.lastName();
            const username = faker.internet.username({ firstName: firstname, lastName: lastname }).toLowerCase();
            const email = faker.internet.email({ firstName: firstname, lastName: lastname }).toLowerCase();

            const user = new User({
                email,
                username,
                firstname,
                lastname,
                password: await bcrypt.hash('password', 10),
                role: 'user',
                realm: realm._id,
                state: 'active'
            });
            await user.save();

            for (let j = 1; j <= 5; j++) {
                const task = new Task({
                    title: faker.lorem.sentence(),
                    description: faker.lorem.paragraph(),
                    assigned: user._id,
                    state: 'submitted',
                    priority: 'medium',
                    realm: realm._id,
                    startDate: faker.date.past(),
                    endDate: faker.date.future(),
                    dueDate: faker.date.future(),
                });
                await task.save();
            }
        }
    }

    console.log('Realm seeded successfully with users and tasks.');
}

module.exports = seedRealm;