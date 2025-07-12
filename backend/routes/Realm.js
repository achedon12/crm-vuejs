const express = require('express')

const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Realm = require('../models/Realm');
const sendMail = require("../utils/mailer");
const verifyToken = require("../middleware/jwt");
const {Catch} = require("../utils/errors/Catch");
const { isSuperAdmin } = require('../utils/isSuperAdmin');

router.post('/', verifyToken, async (req, res) => {
    try {
        if (await isSuperAdmin(req.userId)) {
            const newRealm = new Realm(req.body);
            const realmCreated = await newRealm.save();
            const adminUser = new User({
                email: '',
                username: 'admin_' + realmCreated.name.replace(/\s+/g, '_').toLowerCase(),
                firstname: 'admin',
                lastname: 'admin',
                password: 'admin',
                role: 'admin',
                realm: realmCreated._id,
                state: 'active'
            });
            await adminUser.save();
            res.status(201).json({realm: realmCreated, admin: adminUser});
        }
    } catch (error) {
        Catch(error,res);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        if (await isSuperAdmin(req.userId)) {
            const realms = await Realm.find();
            res.status(200).json(realms);
        } else {
            return res.status(403).json({message: 'You do not have permission to view realms'});
        }
    } catch (error) {
        Catch(error);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        if (await isSuperAdmin(req.userId)) {
            const realm = await Realm.findById(req.params.id);
            if (!realm) {
                return res.status(404).json({message: 'Realm not found'});
            }
            res.status(200).json(realm);
        } else {
            return res.status(403).json({message: 'You do not have permission to view this realm'});
        }
    } catch (error) {
        Catch(error);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (await isSuperAdmin(req.userId)) {
            const realm = await Realm.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if (!realm) {
                return res.status(404).json({message: 'Realm not found'});
            }
            res.status(200).json(realm);
        }
        else {
            return res.status(403).json({message: 'You do not have permission to update this realm'});
        }
    } catch (error) {
        Catch(error);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (await isSuperAdmin(req.userId)) {
            const realm = await Realm.findByIdAndDelete(req.params.id);
            if (!realm) {
                return res.status(404).json({message: 'Realm not found'});
            }
            await User.deleteMany({realm: req.params.id});
            await Task.deleteMany({realm: req.params.id});
            res.status(200).json({message: 'Realm deleted successfully'});
        } else {
            return res.status(403).json({message: 'You do not have permission to delete this realm'});
        }
    } catch (error) {
        Catch(error);
    }
});

router.get('/:id/users', verifyToken, async (req, res) => {
    try {
        if (await isSuperAdmin(req.userId)) {
            const users = await User.find({realm: req.params.id});
            res.status(200).json(users);
        } else {
            return res.status(403).json({message: 'You do not have permission to view users in this realm'});
        }
    } catch (error) {
        Catch(error);
    }
});

module.exports = router;