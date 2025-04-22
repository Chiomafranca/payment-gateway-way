const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        profilePicture: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        address: { type: String, required: false },
        passwordResetToken: { type: String, required: false },
        resetTokenExpiry: { type: Date, required: false },
    },
    { timestamps: true }
);



module.exports = mongoose.model('User', userSchema);
