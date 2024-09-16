// routes/productRoutes.js

const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts
} = require('../controllers/productController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // In-memory storage for image files

// Public routes
// router.get('/products', getProducts);

router.get('/products/:id', getProductById);


// Protected routes
router.get('/products',authenticateToken, authorizeRoles('ADMIN','USER'), getAllProducts);
router.post('/products', authenticateToken, authorizeRoles('ADMIN'), 
upload.single('image'), createProduct);
router.patch('/products/:id', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), updateProduct);

router.delete('/products/:id', authenticateToken, authorizeRoles('ADMIN'), deleteProduct);

module.exports = router;
