// controllers/categoryController.js

const CartDto = require('../dto/cartDto');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: 'Category created', category });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category updated', category });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



exports.getCartItemsByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // or req.user.id if you're using authentication middleware

        // Fetch cart items for the user
        const carts = await Cart.find({ userId }).populate('productId');

        // Extract product IDs from the cart items
        const productIds = carts.map(cart => cart.productId);

        // Fetch products based on the product IDs
        const products = await Product.find({ _id: { $in: productIds } });

        // Create a map for products by their ID
        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        // Map cart items to CartDto
        const cartDtos = carts.map(cart => {
            const product = productMap.get(cart.productId.toString());
            return new CartDto(cart, product);
        });

        res.status(200).json(cartDtos);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
