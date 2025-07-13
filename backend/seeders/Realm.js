const Realm = require('../models/Realm');
const User = require("../models/User");
const Task = require('../models/Task');
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");

const roles = User.schema.path('role').enumValues;
const userStates = User.schema.path('state').enumValues;
const taskStates = Task.schema.path('state').enumValues;
const priorities = Task.schema.path('priority').enumValues;

const seedRealm = async () => {
    await Realm.deleteMany({});
    await User.deleteMany({});
    await Task.deleteMany({});

    const realms = Array.from({ length: 5 }, () => ({
        name: faker.company.name(),
        description: faker.company.catchPhrase()
    }));

    for (const realmData of realms) {
        const realm = new Realm(realmData);
        await realm.save();

        for (let a = 0; a < 2; a++) {
            const firstname = faker.person.firstName();
            const lastname = faker.person.lastName();
            const username = "admin " + faker.internet.username({ firstName: firstname, lastName: lastname }).toLowerCase();
            const email = faker.internet.email({ firstName: firstname, lastName: lastname }).toLowerCase();

            const adminUser = new User({
                email,
                username,
                firstname,
                lastname,
                password: await bcrypt.hash('admin', 10),
                role: 'admin',
                realm: realm._id,
                state: 'active'
            });
            await adminUser.save();
        }

        for (let i = 0; i < 10; i++) {
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
                role: faker.helpers.arrayElement(roles),
                realm: realm._id,
                state: faker.helpers.arrayElement(userStates)
            });
            await user.save();

            for (let j = 0; j < 10; j++) {
                const startDate = faker.date.past();
                const endDate = faker.date.future({ refDate: startDate });
                const dueDate = faker.date.future({ refDate: startDate });

                const task = new Task({
                    title: faker.lorem.sentence(),
                    description: faker.lorem.paragraph(),
                    assigned: user._id,
                    state: faker.helpers.arrayElement(taskStates),
                    priority: faker.helpers.arrayElement(priorities),
                    realm: realm._id,
                    startDate,
                    endDate,
                    dueDate,
                    tags: faker.lorem.words({ min: 1, max: 4 }).split(' ')
                });
                await task.save();
            }
        }
    }

    console.log('Realm seeded successfully with users and tasks.');
}

module.exports = seedRealm;