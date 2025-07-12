const mongoose = require('mongoose');

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
        default: null
    },
    state: {
        type: String,
        enum: ['submitted', 'in_progress', 'done', 'archived'],
        default: 'submitted'
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
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
    realm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Realm',
        required: true
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