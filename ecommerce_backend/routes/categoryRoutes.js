// routes/categoryRoutes.js

const express = require('express');
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);

// Protected routes
router.post('/categories', authenticateToken, authorizeRoles('ADMIN'), createCategory);
router.patch('/categories/:id', authenticateToken, authorizeRoles('ADMIN'), updateCategory);
router.delete('/categories/:id', authenticateToken, authorizeRoles('ADMIN'), deleteCategory);

module.exports = router;
