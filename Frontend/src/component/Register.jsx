import { TextField, Button } from "@mui/material";
import "./loginAndRegister.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle user registration
  const registerUser = async () => {
    try {
      // Send a POST request to register the user
      await axios.post(`http://localhost:3000/api/users/register`, {
        username,
        email,
        password,
      });

      // Show a success toast message
      toast.success("Successfully Registered", 3000);
      // Navigate to the login page
      navigate("/login");
    } catch (error) {
      // Show an error toast message
      toast.error("Something went wrong", 3000);
    }
  };

  return (
    <section className="login-container">
      <div className="login-header">
        <div className="header">REGISTER</div>
        <p>Get Started With Chat-Bot</p>
      </div>
      {/* Input field for username */}
      <TextField
        label="User Name"
        variant="outlined"
        onChange={(event) => setUsername(event.target.value)}
      />
      {/* Input field for email */}
      <TextField
        label="Email"
        variant="outlined"
        onChange={(event) => setEmail(event.target.value)}
      />
      {/* Input field for password */}
      <TextField
        label="Password"
        variant="outlined"
        onChange={(event) => setPassword(event.target.value)}
        type="password"
      />
      <div className="subtitle">
        Do you have any Account? <a href="/login">Sign In</a>
      </div>
      {/* Submit button to trigger registration */}
      <Button
        variant="contained"
        onClick={async () => {
          await registerUser();
        }}
      >
        {" "}
        Submit
      </Button>
    </section>
  );
};

export default Register;

