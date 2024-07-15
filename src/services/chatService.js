const Chat = require("../model/Chat");

// Function to add a new Chat to the database
const createChat = async (data) => {
    try {
        // Create a new Chat document in the database with the provided data
        const responseData = await Chat.create(data);
        return responseData;
    } catch (error) {
        // If an error occurs during the creation process, throw the error
        throw error;
    }
}

// Function to fetch Chats from the database based on specified criteria
const getAllChatHistory = async (userId, query) => {
    try {
        const fetchAllData = await Chat.find({});
        return fetchAllData;
    } catch (error) {
        // If an error occurs during the fetch process, throw the error
        throw error;
    }
}


module.exports = {
    createChat,
    getAllChatHistory,
}