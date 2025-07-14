const express = require('express')
const verifyToken = require("../middleware/jwt");
const Notification = require('../models/Notification');
const {Notifications: defaultNotifications} = require('../utils/notifications/UserNotification');

const router = express.Router();

router.get('/list/:userId', verifyToken, async (req, res) => {
    try {
        for (const notif of defaultNotifications) {
            const exists = await Notification.findOne({user: req.params.userId, message: notif.message});
            if (!exists) {
                await Notification.create({
                    user: req.params.userId,
                    message: notif.message,
                    action: notif.action,
                });
            }
        }

        const notifications = await Notification.find({user: req.params.userId}).sort({createdAt: -1});
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.post('/switch', verifyToken, async (req, res) => {
    try {
        const {_id} = req.body;
        const notification = await Notification.findById(_id);
        if (!notification) {
            return res.status(404).json({error: 'Notification not found'});
        }
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({error: 'Forbidden'});
        }
        notification.active = !notification.active;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;