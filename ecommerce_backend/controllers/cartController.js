// controllers/cartController.js

const CartDto = require('../dto/cartDto');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new cart item
exports.createCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if user and product exist
        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        const productExists = await Product.findById(productId);
        if (!productExists) return res.status(404).json({ message: 'Product not found' });

        // Calculate total price
        const totalPrice = productExists.price * quantity;

        const cart = new Cart({
            userId,
            productId,
            quantity,
            totalPrice
        });

        await cart.save();

        res.status(201).json({ message: 'Cart item created', cart });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all cart items
exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('userId').populate('productId');
        res.status(200).json(carts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a cart item by ID
exports.getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate('userId').populate('productId');

        if (!cart) return res.status(404).json({ message: 'Cart item not found' });

        res.status(200).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a cart item by ID
exports.updateCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, productId, quantity } = req.body;

        // Check if user and product exist
        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        const productExists = await Product.findById(productId);
        if (!productExists) return res.status(404).json({ message: 'Product not found' });

        // Calculate total price
        const totalPrice = productExists.price * quantity;

        const cart = await Cart.findByIdAndUpdate(id, {
            userId,
            productId,
            quantity,
            totalPrice
        }, { new: true });

        if (!cart) return res.status(404).json({ message: 'Cart item not found' });

        res.status(200).json({ message: 'Cart item updated', cart });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a cart item by ID
exports.deleteCart = async (req, res) => {
    try {
        const { id } = req.params;

        const cart = await Cart.findByIdAndDelete(id);

        if (!cart) return res.status(404).json({ message: 'Cart item not found' });

        res.status(200).json({ message: 'Cart item deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};





// Helper function to get product price
const getPriceForProduct = async (productId) => {
    const product = await Product.findById(productId).populate('category'); 

    if (!product) {
        throw new Error('Product not found');
    }
    return product.price;
};

// Add a product to the cart
exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // Assuming userId is attached to the request after authentication

        // Find if product already exists in cart
        const existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            // Increment quantity and update total price
            const newQuantity = existingCartItem.quantity + 1;
            const pricePerUnit = await getPriceForProduct(productId);
            const newTotalPrice = pricePerUnit * newQuantity;

            existingCartItem.quantity = newQuantity;
            existingCartItem.totalPrice = newTotalPrice;

            const updatedCartItem = await existingCartItem.save();
            return res.status(200).json(updatedCartItem);
        } else {
            // Add new product to cart
            const price = await getPriceForProduct(productId);
            const newCartItem = new Cart({
                userId,
                productId,
                quantity: 1,
                totalPrice: price
            });

            const savedCartItem = await newCartItem.save();
            return res.status(201).json(savedCartItem);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Decrement product quantity in the cart
exports.decrementCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // Assuming userId is attached to the request after authentication
         console.log("productId: ",productId)
         console.log("userId: ",userId)
        // Find the product in the user's cart
        const existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity - 1;
            const pricePerUnit = await getPriceForProduct(productId);

            if (newQuantity > 0) {
                // Update cart with new quantity and total price
                const newTotalPrice = pricePerUnit * newQuantity;
                existingCartItem.quantity = newQuantity;
                existingCartItem.totalPrice = newTotalPrice;

                const updatedCartItem = await existingCartItem.save();
                return res.status(200).json(updatedCartItem);
            } else if (existingCartItem.quantity === 1) {
                // Remove the cart item if the quantity becomes 0
                await Cart.deleteOne({ _id: existingCartItem._id });
                return res.status(200).json({ message: 'Product removed from cart' });
            }
        }
        return res.status(404).json({ message: 'Cart item not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get total quantity for the logged-in user
exports.getTotalQuantityByUserId = async (req, res) => {
    try {
        // Assuming that `req.user` contains the authenticated user's ID from the token
        const userId = req.user.id;
        console.log("userId: ", userId)
        // Aggregate to sum up the total quantity for the logged-in user
        const totalQuantity = await Cart.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },  // Match cart items for the user
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" }  // Sum up the quantity field
                }
            }
        ]);
       console.log("totalQuantity: ",totalQuantity)
        // If no cart items found, return zero
        const total = totalQuantity.length > 0 ? totalQuantity[0].totalQuantity : 0;

        res.status(200).json({ totalQuantity: total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCartItemsByUserId = async (req, res) => {
    try {
        const userId = req.user.id; // Ensure this is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Fetch cart items for the user
        const carts = await Cart.find({ userId }).populate('productId');

        // Extract product IDs from the cart items
        const productIds = carts.map(cart => cart.productId._id);

        // Fetch products based on the product IDs
        const products = await Product.find({ _id: { $in: productIds } });

        // Create a map for products by their ID
        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        // Map cart items to CartDto
        const cartDtos = carts.map(cart => {
            const product = productMap.get(cart.productId._id.toString());
            return new CartDto(cart, product);
        });

        res.status(200).json(cartDtos);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        // Call the method to delete the cart item
        const result = await Cart.deleteByUserIdAndProductId(userId, productId);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item cleared successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};