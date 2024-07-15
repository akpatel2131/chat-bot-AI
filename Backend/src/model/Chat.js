const mongoose = require("mongoose");

// Define the schema for chat messages
const chatSchema = new mongoose.Schema(
  {
    // The message content
    message: {
      type: String,
      required: true,
    },
    // The direction of the message (e.g., sent or received)
    direction: {
      type: String,
      required: true,
    },
    // The sender of the message
    sender: {
      type: String,
      required: true,
    },
    // The ID of the user associated with this chat message
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    // Enable timestamps to automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create a Mongoose model for the chat schema
const Chat = mongoose.model("Chat", chatSchema);

// Export the Chat model to be used in other parts of the application
module.exports = Chat;
