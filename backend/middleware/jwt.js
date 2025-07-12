const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = verifyToken;