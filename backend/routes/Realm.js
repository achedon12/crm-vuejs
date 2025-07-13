const express = require('express')

const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Realm = require('../models/Realm');
const sendMail = require("../utils/mailer");
const verifyToken = require("../middleware/jwt");
const {Catch} = require("../utils/errors/Catch");
const {hash} = require("bcrypt");

router.post('/', verifyToken, async (req, res) => {
    try {
        const newRealm = new Realm(req.body);
        const realmCreated = await newRealm.save();
        const adminUser = new User({
            email: 'default_admin_' + realmCreated.name.replace(/\s+/g, '_').toLowerCase() + '@default.com',
            username: 'default_admin_' + realmCreated.name.replace(/\s+/g, '_').toLowerCase(),
            firstname: 'default',
            lastname: 'admin',
            password: 'admin',
            role: 'admin',
            realm: realmCreated._id,
            state: 'active'
        });
        adminUser.password = await hash('admin', 10);
        await adminUser.save();
        const realmObj = realmCreated.toObject();
        realmObj.users = [adminUser];
        res.status(201).json(realmObj);
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const realms = await Realm.find();
        const realmsWithUsers = await Promise.all(
            realms.map(async (realm) => {
                const users = await User.find({ realm: realm._id }).select('-password -__v').populate('realm');
                return { ...realm.toObject(), users };
            })
        );
        res.status(200).json(realmsWithUsers);
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findById(req.params.id)
        if (!realm) {
            return res.status(404).json({message: 'Realm not found'});
        }
        res.status(200).json(realm);

    } catch (error) {
        Catch(error);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        let realm = await Realm.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!realm) {
            return res.status(404).json({message: 'Realm not found'});
        }
        const users = await User.find({realm: realm._id}).select('-password -__v');
        realm = realm.toObject();
        realm.users = users;
        res.status(200).json(realm);
    } catch (error) {
        Catch(error, res);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findByIdAndDelete(req.params.id);
        if (!realm) {
            return res.status(404).json({message: 'Realm not found'});
        }
        await User.deleteMany({realm: req.params.id});
        await Task.deleteMany({realm: req.params.id});
        res.status(200).json({message: 'Realm deleted successfully'});

    } catch (error) {
        Catch(error);
    }
});

router.get('/:id/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find({realm: req.params.id});
        res.status(200).json(users);

    } catch (error) {
        Catch(error);
    }
});

router.get('/statistics/:realmId/:userId', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({realm: req.params.realmId});
        const statistics = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.state === 'done').length,
            inProgressTasks: tasks.filter(task => task.state === 'in_progress').length,
            archivedTasks: tasks.filter(task => task.state === 'archived').length,
            pendingTasks: tasks.filter(task => task.state === 'submitted').length,

            myTotalTasks: tasks.filter(task => task.assigned && task.assigned.toString() === req.params.userId).length,
            myCompletedTasks: tasks.filter(task => task.assigned && task.assigned.toString() === req.params.userId && task.state === 'done').length,
            myInProgressTasks: tasks.filter(task => task.assigned && task.assigned.toString() === req.params.userId && task.state === 'in_progress').length,
            myArchivedTasks: tasks.filter(task => task.assigned && task.assigned.toString() === req.params.userId && task.state === 'archived').length,
            myPendingTasks: tasks.filter(task => task.assigned && task.assigned.toString() === req.params.userId && task.state === 'submitted').length,

            myTasksOverLast3Months: tasks.filter(task => task.assigned && task.assigned.toString() === req.params.userId && new Date(task.createdAt) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),

            usersOfMyRealm: await User.find({realm: req.params.realmId}).select('-password -__v')
        };

        res.status(200).json(statistics);
    } catch (error) {
        Catch(error, res);
    }
});

module.exports = router;