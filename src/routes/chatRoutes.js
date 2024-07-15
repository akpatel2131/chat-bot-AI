const express = require("express");
const route = express.Router();
const chatController = require("../controller/chatController");

const authenticateToken = require("../middleware/authenticateToken");

// Route to create a new chat, with authentication
route.post("/", authenticateToken, chatController.createNewChat);

// Route to get all chat history, with authentication
route.get("/", authenticateToken, chatController.getAllChats);


module.exports = route;