const chatService = require("../services/chatService");

// Function to create a new chat
const createNewChat = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user.id;

        // Get the chat data from the request body and assign the user ID to it
        const chatData = req.body;
        chatData.userId = userId;

        // Call the chat service to create a new chat with the provided data
        const data = await chatService.createChat(chatData);

        // Send the response with the created chat data
        res.status(201).json(data);
    } catch (error) {
        // If an error occurs, send an error response with the error message
        res.status(500).json({
            message: error.message,
        });
    }
}

// Function to get all chat history
const getAllChats = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user.id;

        // Call the chat service to get all chat history for the user
        const fetchedData = await chatService.getAllChatHistory(userId);

        // Send the response with the fetched chat data
        res.status(200).json(fetchedData);
    } catch (error) {
        // If an error occurs, send an error response with the error message
        res.status(500).json({
            message: error.message,
        });
    }
}




module.exports = {
    createNewChat,
    getAllChats,
}

