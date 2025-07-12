const Administrator = require('../models/Administrator');

async function isSuperAdmin(userId) {
    if (!userId) return false;
    const admin = await Administrator.findById(userId);
    return !!admin;
}

module.exports = { isSuperAdmin };