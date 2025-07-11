const mongoose = require('mongoose');
const User = require('./User');

const RealmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    administrators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(adminIds) {
                const admins = await User.find({ _id: { $in: adminIds } });
                return admins.every(user => user.role === 'admin');
            },
            message: 'Tous les administrateurs doivent avoir le rôle admin.'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Realm', RealmSchema);