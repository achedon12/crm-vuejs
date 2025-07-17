const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();
const User = require('../models/User');
const Administrator = require('../models/Administrator');
const sendMail = require("../utils/mailer");
const verifyToken = require("../middleware/jwt");

router.post('/login', async (req, res) => {
    try {
        let user;
        let isSuperAdmin = false;
        const identifier = req.body.emailOrUsername;

        user = await User.findOne({
            $or: [
                {email: identifier},
                {username: identifier}
            ]
        });

        if (!user) {
            isSuperAdmin = true;
            user = await Administrator.findOne({
                $or: [
                    {email: identifier},
                    {username: identifier}
                ]
            });
        } else {
            user.populate('realm');
        }

        if (!req.body.password || !user.password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!user || (!isSuperAdmin && user.state !== 'active')) {
            return res.status(404).json({error: 'User not found'});
        }

        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({
                email: user.email,
                role: user.role,
                id: user._id,
                isSuperAdmin,
                realm: isSuperAdmin ? null : user.realm,
            }, process.env.JWT_SECRET);

            res.status(200).json({token, user, isSuperAdmin});
        } else {
            res.status(401).json({message: 'Invalid password'});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        let user;

        user = await User.findOne({email: req.body.email});

        if (!user) {
            user = await Administrator.findOne({email: req.body.email});
        }

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const newPassword = crypto.randomBytes(8).toString('hex');
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        await sendMail(user.email, 'Password Reset', 'reset_password.html', {newPassword, firstname: user.firstname});

        res.status(200).json({message: 'New password has been sent to your email'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.put('/update-password', verifyToken, async (req, res) => {
    try {
        const user = req.user.isSuperAdmin ? await Administrator.findById(req.user.id) : await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({error: 'Current password is incorrect'});
        }

        user.password = await bcrypt.hash(req.body.newPassword, 10);
        await user.save();
        res.status(200).json({message: 'Password updated successfully'});
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(400).json({message: error.message});
    }
});

module.exports = router;