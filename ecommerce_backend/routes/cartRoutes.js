// routes/cartRoutes.js

const express = require('express');
const {
    createCart,
    getCarts,
    getCartById,
    updateCart,
    deleteCart,
    addToCart,
    decrementCart,
    getTotalQuantityByUserId,
    getCartItemsByUserId,
    clearCart
} = require('../controllers/cartController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/carts', authenticateToken, getCarts);
router.get('/carts/:id', authenticateToken, getCartById);

// Protected routes
router.post('/cart/add', authenticateToken, authorizeRoles('USER', 'ADMIN'), addToCart);
router.post('/cart/decrement', authenticateToken, authorizeRoles('USER', 'ADMIN'),decrementCart);
router.get('/cart/total-quantity', authenticateToken, authorizeRoles('USER', 'ADMIN'),getTotalQuantityByUserId);

router.get('/cart', authenticateToken,authorizeRoles('USER', 'ADMIN'), getCartItemsByUserId);

router.delete('/cart/clear/:productId', authenticateToken,  authorizeRoles('USER', 'ADMIN'),clearCart);


router.post('/carts', authenticateToken, authorizeRoles('USER', 'ADMIN'), createCart);
router.patch('/carts/:id', authenticateToken, authorizeRoles('USER', 'ADMIN'), updateCart);
router.delete('/carts/:id', authenticateToken, authorizeRoles('USER', 'ADMIN'), deleteCart);

module.exports = router;
