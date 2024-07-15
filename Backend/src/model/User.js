
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema({
    // Username field with type string, required
    username: {
        type: String,
        required: true
    },
    // Email field with type string, required and unique
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Password field with type string, required
    password: {
        type: String,
        required: true,
    }
}, {
    // Automatically add createdAt and updatedAt fields
    timestamps: true
});

// Method to compare a given password with the user's stored password
userSchema.methods.comparePassword = async function (loginPassword) {
    // Use bcrypt to compare the provided password with the stored password
    const isMatch = await bcrypt.compare(loginPassword, this.password);
    return isMatch;
};

// Create User model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;