// routes/userRoutes.js

const express = require('express');
const {
    registerUser,
    loginUser,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/users', authenticateToken, authorizeRoles('ADMIN'), createUser);
router.get('/users', authenticateToken, authorizeRoles('ADMIN', 'USER'), getAllUsers);
router.get('/users/:id', authenticateToken, authorizeRoles('ADMIN', 'USER'), getUserById);
router.patch('/users/:id', authenticateToken, authorizeRoles('ADMIN'), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('ADMIN'), deleteUser);

module.exports = router;
