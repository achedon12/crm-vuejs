const mongoose = require('mongoose');

const TaskHistorySchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    action: {
        type: String,
        enum: ['created', 'updated', 'deleted', 'state_changed', 'assigned', 'unassigned', 'title_changed'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('TaskHistory', TaskHistorySchema);