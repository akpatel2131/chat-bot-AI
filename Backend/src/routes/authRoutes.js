
const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");

// Route to handle user registration
router.post("/register", authController.registerController);

// Route to handle user login
router.post("/login", authController.loginController);


module.exports = router;