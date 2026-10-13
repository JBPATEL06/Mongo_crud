const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userProfile: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{10}$/,
        unique: true,
    },


}, {
    timestamps: true
});
const userModel = mongoose.model('User', userSchema,'users123');
module.exports = userModel