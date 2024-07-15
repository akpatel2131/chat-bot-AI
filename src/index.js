require("dotenv").config({path: "src/.env"})
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");

// Create an Express application
const app = express();

// Set the port number from environment variables
const PORT = process.env.PORT;

app.use(cors())

// Middleware to parse JSON requests
app.use(express.json());

// Route middleware for user authentication routes
app.use("/api/users", authRoutes);

// Route middleware for movie routes
app.use("/api/chats", chatRoutes);

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Failed to connect MongoDB", error);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log("Server running at port:", PORT);
});