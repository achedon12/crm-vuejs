const express = require('express')

const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Realm = require('../models/Realm');
const bcrypt = require('bcrypt');
const sendMail = require("../utils/mailer");
const verifyToken = require("../middleware/jwt");
const {Catch} = require("../utils/errors/Catch");
const {isSuperAdmin} = require("../utils/isSuperAdmin");
const {Notifications} = require("../utils/notifications/UserNotification");

router.post('/create', verifyToken, async (req, res) => {
    try {
        if (!req.user.role || (req.user.role !== 'admin')) {
            return res.status(403).json({message: 'You do not have permission to create users'});
        }
        const newUser = new User(req.body);
        const temporaryPassword = Math.random().toString(36).slice(-8);
        newUser.password = await bcrypt.hash(temporaryPassword, 10);
        const userRegistered = await newUser.save();

        res.status(201).json(userRegistered.populate('realm'))

        // create user notifications
        Notifications.forEach(notification => {
            const newNotification = new Notification({
                user: userRegistered._id,
                message: notification.message,
            });
            newNotification.save()
        });

        await sendMail(req.body.email, 'Account Creation', 'registration.html', {
            user: req.body.firstname + ' ' + req.body.lastname,
            email: req.body.email,
            password: temporaryPassword,
            app: process.env.APP_URL + '/login/'
        });
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        if (await isSuperAdmin(req.userId) || (req.user.role && req.user.role === 'admin')) {
            const users = await User.find().populate('realm');
            res.status(200).json(users);
        } else {
            return res.status(403).json({message: 'You do not have permission to view users'});
        }
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('realm');
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user.populate('realm'));
    } catch (error) {
        Catch(error, res);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('realm');
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        if (req.user.id !== req.params.id && !(req.user.role && req.user.role === 'admin' && user.realm && user.realm.equals(req.user.realm))) {
            return res.status(403).json({message: 'You do not have permission to update this user'});
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('realm');
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        Catch(error, res);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        if (req.userId !== req.params.id && !(req.user.role && req.user.role === 'admin' && user.realm && user.realm.equals(req.user.realm))) {
            return res.status(403).json({message: 'You do not have permission to delete this user'});
        }

        await Task.deleteMany({assignedTo: user._id});
        await user.remove();
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/realm/:id', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findById(req.params.id);
        if (!realm) {
            return res.status(404).json({error: 'Realm not found'});
        }

        const users = await User.find({realm: req.params.id}).populate('realm');
        return res.status(200).json(users);
    } catch (error) {
        Catch(error, res);
    }
});

module.exports = router;