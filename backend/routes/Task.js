const express = require('express')
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');
const TaskComment = require('../models/TaskComment');
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

        const taskHistory = new TaskHistory()
        taskHistory.task = taskRegistered._id;
        taskHistory.action = 'created';
        taskHistory.user = req.user.id;
        await taskHistory.save();

        const history = await TaskHistory.find({task: taskRegistered._id}).populate('user', 'username firstname lastname email email');

        await ensureUserNotifications(req.user.realm, 'task_created');

        return res.status(201).json({
            ...taskRegistered.toObject(),
            history,
            comments: []
        });
    } catch (error) {
        console.log(error);
        Catch(error, res);
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.isSuperAdmin) {
            return res.status(403).json({message: 'Super Admins cannot update tasks directly'});
        }

        const taskToUpdate = await Task.findById(req.params.id).populate([
            {path: 'realm'}
        ]);

        if (!taskToUpdate) {
            return res.status(404).json({error: 'Task not found'});
        }

        if (req.user.role !== 'admin' && taskToUpdate.realm._id !== req.user.realm.toString()) {
            return res.status(403).json({message: 'You do not have permission to update this task'});
        }

        const updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {new: true});

        let action = 'updated';
        if (taskToUpdate.state !== updatedTask.state) {
            action = 'state_changed';
        } else if (taskToUpdate.assigned?.toString() !== updatedTask.assigned?.toString()) {
            action = 'updated'; // ou 'assigned_changed' si tu veux un event spécifique
        } else if (taskToUpdate.assigned && !updatedTask.assigned) {
            action = 'unassigned';
        } else if (!taskToUpdate.assigned && updatedTask.assigned) {
            action = 'assigned';
        } else if (taskToUpdate.title !== updatedTask.title) {
            action = 'title_changed';
        }

        const taskHistory = new TaskHistory({
            task: updatedTask._id,
            action,
            user: req.user.id.toString()
        });
        await taskHistory.save();

        if (updatedTask.assigned && updatedTask.assigned._id === req.user.id.toString()) {
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

        const history = await TaskHistory.find({task: updatedTask._id}).populate('user', 'username firstname lastname email');
        const comments = await TaskComment.find({task: updatedTask._id}).populate('user', 'username firstname lastname email email _id');

        res.status(200).json({
            ...updatedTask.toObject(),
            history,
            comments
        });
    } catch (error) {
        console.error(error);
        Catch(error, res);
    }
});

router.get('/realm/:realmId', verifyToken, async (req, res) => {
    try {
        const realm = await Realm.findById(req.params.realmId);
        if (!realm) {
            return res.status(404).json({error: 'Realm not found'});
        }
        const tasks = await Task.find({realm: req.params.realmId}).populate('assigned', '-password -__v')
        res.status(200).json(tasks);
    } catch (error) {
        Catch(error, res);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        if (task.realm.toString() !== task.realm.toString()) {
            return res.status(403).json({message: 'You do not have permission to view this task'});
        }

        task = await task.populate([
            {path: 'assigned', select: '-password -__v'},
            {path: 'realm', select: '-__v'},
        ]);

        const history = await TaskHistory.find({task: task._id}).populate('user', 'username firstname lastname email');
        const comments = await TaskComment.find({task: task._id}).populate('user', 'username firstname lastname email email _id');

        res.status(200).json({...task.toObject(), history, comments});
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
            return res.status(404).json({error: 'Task not found'});
        }

        if (taskToDelete.realm.toString() !== req.user.realm.toString()) {
            return res.status(403).json({message: 'You do not have permission to delete this task'});
        }

        await TaskComment.deleteMany({task: taskToDelete._id});
        await TaskHistory.deleteMany({task: taskToDelete._id});
        await Task.findByIdAndDelete(req.params.id);

        await ensureUserNotifications(req.user.realm, 'task_deleted');

        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        Catch(error, res);
    }
});

module.exports = router;