// controllers/orderController.js

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if user and product exist
        const userExists = await User.findById(userId);
        const productExists = await Product.findById(productId);

        if (!userExists) return res.status(404).json({ message: 'User not found' });
        if (!productExists) return res.status(404).json({ message: 'Product not found' });

        const order = new Order({
            userId,
            productId,
            quantity
        });

        await order.save();

        res.status(201).json({ message: 'Order created', order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('productId');
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('userId').populate('productId');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, productId, quantity } = req.body;

        // Check if user and product exist
        const userExists = await User.findById(userId);
        const productExists = await Product.findById(productId);

        if (!userExists) return res.status(404).json({ message: 'User not found' });
        if (!productExists) return res.status(404).json({ message: 'Product not found' });

        const order = await Order.findByIdAndUpdate(id, {
            userId,
            productId,
            quantity
        }, { new: true });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order updated', order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByIdAndDelete(id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
