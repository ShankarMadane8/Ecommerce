// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and attach user to req
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ 
         statusCode: 401,
         errorMessage: 'Unauthorized: No token provided'
    });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ 
           statusCode: 403,
           errorMessage: 'Forbidden: Invalid token'
        });
    ;
        req.user = user;
        next();
    });
};

// Middleware to check user role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };



