const authService = require("../services/authService");


const registerController = async(req,res) => {

    try {

        // save the req.body data is requestPayload variable.
        const requestPayload = req.body;

        // call register service function
        const registerData = await authService.register(requestPayload);

        // send the response with message and userId
        res.status(201).json({
            message: "User registered Successfully",
            userId: registerData._id
        })

    }catch (error) {

        // throw error if process is fails
        res.status(500).json({
            message: error.message
        })
    }

}

// Controller function to handle user login
const loginController = async (req, res) => {
    try {
        // Extract user payload from request body
        const userPayload = req.body;

        // Call the authService to perform login and obtain token and user data
        const { token, userData } = await authService.login(userPayload);

        // Send a success response with token and user data
        res.status(200).json({
            message: "User logged in successfully",
            token,
            userData
        });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {
    registerController,
    loginController
}