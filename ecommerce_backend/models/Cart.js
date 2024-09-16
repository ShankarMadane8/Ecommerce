// models/Cart.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Cart schema
const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Schema.Types.Decimal128,
        required: true
    }
}, { timestamps: true });

// Static method to delete cart item by userId and productId
cartSchema.statics.deleteByUserIdAndProductId = async function(userId, productId) {
    return this.deleteOne({ userId, productId });
};

// Create and export the Cart model
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
