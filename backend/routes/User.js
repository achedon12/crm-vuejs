const express = require('express')

const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Realm = require('../models/Realm');
const bcrypt = require('bcrypt');
const sendMail = require("../utils/mailer");
const verifyToken = require("../middleware/jwt");
const {Catch} = require("../utils/errors/Catch");

router.post('/create', verifyToken, async (req, res) => {
    try {
        if (!req.user.isSuperAdmin && req.user.role !== 'admin') {
            return res.status(403).json({message: 'You do not have permission to create users'});
        }
        if (!req.user.isSuperAdmin && (req.body.role && req.body.role === 'admin')) {
            return res.status(403).json({message: 'You can only create users with the role "user"'});
        }
        const newUser = new User(req.body);

        const temporaryPassword = Math.random().toString(36).slice(-8);
        newUser.password = await bcrypt.hash(temporaryPassword, 10);

        const userRegistered = await newUser.save();

        res.status(201).json(userRegistered)

        await sendMail(req.body.email, 'Account Creation', 'registration.html', {
            user: req.body.firstname + ' ' + req.body.lastname,
            email: req.body.email,
            password: temporaryPassword,
            app: process.env.APP_URL + '/auth/login/'
        });
    } catch (error) {
        Catch(error);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (!req.user.isSuperAdmin && req.user.role !== 'admin') {
            return res.status(403).json({message: 'You do not have permission to update users'});
        }

        // check if the user is trying to update a user in a different realm
        if (!req.user.isSuperAdmin) {
            const userToUpdate = await User.findById(req.params.id);
            if (!userToUpdate) {
                return res.status(404).json({message: 'User not found'});
            }
            const userRealm = await Realm.find({administrators: req.user.id});
            const userRealmIds = userRealm.map(realm => realm._id.toString());
            if (!userRealmIds.includes(userToUpdate.realm.toString())) {
                return res.status(403).json({message: 'You do not have permission to update this user'});
            }
        }

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        );

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
        Catch(error);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        if (!req.user.isSuperAdmin && req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({message: 'You do not have permission to view this user'});
        }
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        await Task.updateMany(
            {user: user._id, state: {$nin: ['done', 'archived']}},
            {$set: {assigned: null}}
        );

        user.state = 'inactive';
        await user.save();
        res.status(200).json({message: 'User deleted'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;