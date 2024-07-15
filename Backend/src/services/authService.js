const bcrypt = require("bcryptjs");
const User = require("../model/User");
const JWT = require("jsonwebtoken");

const register = async (data) => {
    try {
        // Destructuring the email from data
        const {email} = data;

        //find if user is already exist or not
        const userData = await User.findOne({ email });

        // throw error if user is already exist.
        if(userData) {
            throw new Error ("User is already exists")
        }

        // posting the data on user db.
        const user = new User(data);

        // Create salt for bcrypt the user password for security purpose
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);

        // replace the user password to hash password
        user.password = hashPassword;

        // save the updated user data;
        user.save();

        //return saved user object
        return user;

    }catch (error) {
        throw error;
    }
}

const login = async (data) => {

    try {

        // Destructure email and password from the input data
        const { email, password } = data;

        // Find user in the database by email
        const userData = await User.findOne({ email });

        // If user does not exist, throw an error
        if (!userData) {
            throw new Error("User does not exist");
        }

        // Check if the provided password matches the stored password
        const checkPassword = await userData.comparePassword(password);

        // If the password does not match, throw an error
        if (!checkPassword) {
            throw new Error("Password does not match with registered password");
        }

        // Generate a JWT token with the user ID as payload
        const token = await JWT.sign({ id: userData._id }, process.env.JWT_SECRET);

        // Return the token and user data
        return { token, userData };

    } catch (error) {
        // If any error occurs, throw it
        throw error;
    }

}



module.exports = {
    register,
    login,
}