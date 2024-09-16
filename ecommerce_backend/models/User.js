// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    userType: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
