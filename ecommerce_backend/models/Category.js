// models/Category.js

const mongoose = require('mongoose');


// Define the Category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    }
}, { timestamps: true });

// Create and export the Category model
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
