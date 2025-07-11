const mongoose = require('mongoose');
const State = require('./State');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: String,
        enum: ['todo', 'in_progress', 'done', 'archived'],
        default: 'todo'
    },
    startDate: {
        type: Date,
        required: true,
        default: null
    },
    endDate: {
        type: Date,
        required: false,
        default: null
    },
    dueDate: {
        type: Date,
        required: false,
        default: null
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Task', TaskSchema);