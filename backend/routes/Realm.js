const express = require('express')

const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Realm = require('../models/Realm');
const sendMail = require("../utils/mailer");
const verifyToken = require("../middleware/jwt");
const {Catch} = require("../utils/errors/Catch");

router.post('/create', verifyToken, async (req, res) => {
    try {
        const newRealm = new Realm(req.body);

        if (req.user.isSuperAdmin && !req.body.administrators) {
            return res.status(400).json({message: 'Super Admins must assign at least one administrator to the realm'});
        }
        if (!req.user.isSuperAdmin && !req.body.administrators) {
            newRealm.administrators = [req.user.id];
        }
        const realmCreated = await newRealm.save();
        res.status(201).json(realmCreated);
    } catch (error) {
        Catch(error);
    }
});

router.get('/list', verifyToken, async (req, res) => {
    try {
        let realms;
        if (req.user.isSuperAdmin) {
            realms = await Realm.find();
        } else {
            realms = await Realm.find({administrators: req.user.id});
        }
        res.status(200).json(realms);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findById(req.params.id);

        if (!realm) {
            return res.status(404).json({message: 'Realm not found'});
        }

        // Check if the user has permission to update the realm
        if (!req.user.isSuperAdmin && !realm.administrators.includes(req.user.id)) {
            return res.status(403).json({message: 'You do not have permission to update this realm'});
        }

        realm.set(req.body);
        const realmUpdated = await realm.save();
        res.status(200).json(realmUpdated);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findById(req.params.id);

        if (!realm) {
            return res.status(404).json({message: 'Realm not found'});
        }

        // Check if the user has permission to view the realm
        if (!req.user.isSuperAdmin && !realm.administrators.includes(req.user.id)) {
            return res.status(403).json({message: 'You do not have permission to view this realm'});
        }

        res.status(200).json(realm);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findById(req.params.id);

        if (!realm) {
            return res.status(404).json({message: 'Realm not found'});
        }

        // Check if the user has permission to delete the realm
        if (!req.user.isSuperAdmin && !realm.administrators.includes(req.user.id)) {
            return res.status(403).json({message: 'You do not have permission to delete this realm'});
        }

        // force delete tasks and users associated with the realm
        await Task.deleteMany({realm: realm._id});
        await User.deleteMany({realm: realm._id});

        await Realm.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Realm deleted successfully'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;