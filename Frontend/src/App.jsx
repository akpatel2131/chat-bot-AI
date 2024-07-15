import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./component/Login";
import Register from "./component/Register";
import ChatBox from "./component/Chat";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";



// Configuration object for the application's API endpoint
export const config = {
  endpoint: `http://localhost:3000/v1`,
};

// Main application component
export default function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Route for the registration page */}
          <Route path="/register" element={<Register />} />
          {/* Route for the chat box page */}
          <Route path="/chat" element={<ChatBox />} />
          {/* Default route for the login page */}
          <Route path="/*" element={<Login />} />
        </Routes>
      </BrowserRouter>
      {/* Toast notification container */}
      <ToastContainer
        className="toast-container"
        closeButton={false}
        closeOnClick
      />
    </div>
  );
}

