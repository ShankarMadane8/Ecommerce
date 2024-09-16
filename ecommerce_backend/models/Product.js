// models/Product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Product schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 500
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: Buffer, // Store image as binary data
        required: false
    },
    description: {
        type: String,
        maxlength: 1500
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
