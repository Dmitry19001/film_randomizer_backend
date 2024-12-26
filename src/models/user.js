const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please add a username'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    forceChangePassword: {
        // Manual password change
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('User', userSchema);
