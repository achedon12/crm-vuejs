const express = require('express')
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Realm = require('../models/Realm');
const sendMail = require("../utils/mailer");
const verifyToken = require("../middleware/jwt");
const {Catch} = require("../utils/errors/Catch");
const {ensureUserNotifications} = require("../utils/notifications/UserNotification");

router.post('/', verifyToken, async (req, res) => {
    try {
        if (req.user.isSuperAdmin) {
            return res.status(403).json({message: 'Super Admins cannot create tasks directly'});
        }

        const data = {
            ...req.body,
            realm: req.user.realm
        }

        const newTask = new Task(data);

        const taskRegistered = await newTask.save();

        await ensureUserNotifications(req.user.realm, 'task_created');

        return res.status(201).json(taskRegistered);
    } catch (error) {
        Catch(error, res);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.isSuperAdmin) {
            return res.status(403).json({message: 'Super Admins cannot update tasks directly'});
        }

        const taskToUpdate = await Task.findById(req.params.id);
        if (!taskToUpdate) {
            return res.status(404).json({message: 'Task not found'});
        }

        if (taskToUpdate.realm.toString() !== req.user.realm.toString()) {
            return res.status(403).json({message: 'You do not have permission to update this task'});
        }

        const updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {new: true});

        if (updatedTask.assigned && updatedTask.assigned.toString() == req.user._id.toString()) {
            await ensureUserNotifications(req.user.realm, 'task_assigned');
        } else if (updatedTask.state === 'in_progress') {
            await ensureUserNotifications(req.user.realm, 'task_started');
        } else if (updatedTask.state === 'done') {
            await ensureUserNotifications(req.user.realm, 'task_completed');
        } else if (updatedTask.state === 'archived') {
            await ensureUserNotifications(req.user.realm, 'task_archived');
        } else {
            await ensureUserNotifications(req.user.realm, 'task_updated');
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/realm/:realmId', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findById(req.params.realmId);
        if (!realm) {
            return res.status(404).json({message: 'Realm not found'});
        }
        const tasks = await Task.find({realm: req.params.realmId});

        res.status(200).json(tasks);
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        if (task.realm.toString() !== req.user.realm.toString()) {
            return res.status(403).json({message: 'You do not have permission to view this task'});
        }

        res.status(200).json(task);
    } catch (error) {
        Catch(error, res);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.isSuperAdmin) {
            return res.status(403).json({message: 'Super Admins cannot delete tasks directly'});
        }

        const taskToDelete = await Task.findById(req.params.id);
        if (!taskToDelete) {
            return res.status(404).json({message: 'Task not found'});
        }

        if (taskToDelete.realm.toString() !== req.user.realm.toString()) {
            return res.status(403).json({message: 'You do not have permission to delete this task'});
        }

        await Task.findByIdAndDelete(req.params.id);

        await ensureUserNotifications(req.user.realm, 'task_deleted');

        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        Catch(error, res);
    }
});

module.exports = router;