// controllers/productController.js

const Product = require('../models/Product');
const Category = require('../models/Category');

const createProductDTO = require('../dto/productDTO');
const Cart = require('../models/Cart');
const { default: mongoose } = require('mongoose');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, brand, category, description, price, discount, stock } = req.body;

        console.log("body: ",req.body)
        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(404).json({ message: 'Category not found' });

        const product = new Product({
            name,
            brand,
            category,
            image: req.file ? req.file.buffer : undefined, // Handle image upload
            description,
            price,
            discount,
            stock
        });

        await product.save();

        res.status(201).json({ message: 'Product created', product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');

        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, category, description, price, discount, stock } = req.body;
        console.log("body: ",req.body)
        console.log("req.file: ",req.file)
        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(404).json({ message: 'Category not found' });

        const product = await Product.findByIdAndUpdate(id, {
            name,
            brand,
            category,
            image: req.file ? req.file.buffer : undefined,
            description,
            price,
            discount,
            stock
        }, { new: true });

        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product updated', product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product ID');
        }

        // Delete cart items where productId matches
        const result = await Cart.deleteMany({productId: id });
        const product = await Product.findByIdAndDelete(id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        // Get the user from the request (assuming you use JWT for authentication)
        const userId = req.user.id;

        // Fetch all products
        const products = await Product.find().populate('category');

        // Fetch cart items for the user
        const carts = await Cart.find({ userId: userId });

        // Create a map of productId -> quantity from cart items
        const productQuantityMap = carts.reduce((map, cart) => {
            map[cart.productId.toString()] = cart.quantity;
            return map;
        }, {});

        // Map products to ProductDTO
        const productDTOs = products.map(product => {
            const quantity = productQuantityMap[product._id.toString()] || 0;
            return createProductDTO(product, quantity);
        });

        res.status(200).json(productDTOs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
