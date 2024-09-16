// routes/orderRoutes.js

const express = require('express');
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);

// Protected routes
router.post('/orders', authenticateToken, authorizeRoles('USER', 'ADMIN'), createOrder);
router.patch('/orders/:id', authenticateToken, authorizeRoles('USER', 'ADMIN'), updateOrder);
router.delete('/orders/:id', authenticateToken, authorizeRoles('ADMIN'), deleteOrder);

module.exports = router;
