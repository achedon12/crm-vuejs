const Notification = require('../../models/Notification');
const User = require('../../models/User');
const sendMail = require("../../utils/mailer");

module.exports.Notifications = [
    {
        message: 'Being notified when a new task is created',
        action: 'task_created',
        text: 'A new task has been created in your realm.',
    },
    {
        message: 'Being notified when a task is assigned to you',
        action: 'task_assigned',
        text: 'A task has been assigned to you in your realm.',
    },
    {
        message: 'Being notified when a task is started',
        action: 'task_started',
        text: 'A task has been started in your realm.',
    },
    {
        message: 'Being notified when a task is updated',
        action: 'task_updated',
        text: 'A task has been updated in your realm.',
    },
    {
        message: 'Being notified when a task is archived',
        action: 'task_archived',
        text: 'A task has been archived in your realm.',
    },
    {
        message: 'Being notified when a task is completed',
        action: 'task_completed',
        text: 'A task has been completed in your realm.',
    },
    {
        message: 'Being notified when a new task is deleted',
        action: 'task_deleted',
        text: 'A task has been deleted in your realm.',
    }
]

module.exports.ensureUserNotifications = async (realmId, action) => {
    try {
        const notifications = module.exports.Notifications;
        const users = await User.find({realm: realmId});

        if (!users || users.length === 0) {
            return;
        }

        const userNotifications = await Notification.find({
            action: action,
            user: {$in: users.map(user => user._id)},
            active: true
        }).populate('user');

        if (!userNotifications && userNotifications.length === 0) {
            return;
        }

        for (const notification of userNotifications) {
            const user = notification.user;
            await sendMail(user.email, 'New Notification', 'notification.html', {
                user: user.firstname + ' ' + user.lastname,
                message: notifications.find(n => n.action === action).text,
                app_url: process.env.APP_URL + '/settings'
            });
        }


    } catch (error) {
        console.error('Error ensuring user notifications:', error);
        throw new Error('Failed to ensure user notifications');
    }
}