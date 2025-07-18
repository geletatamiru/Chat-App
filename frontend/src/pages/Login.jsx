import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { connectSocket } from '../../socket/socket';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import "./Login.css"; 
const Login = () => {
  const { setToken, token } = useAuth();
  const [formData, setFormData] = useState({email: "", password: ""});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth", formData)
      const receivedToken = res.headers["x-auth-token"];
      if (!receivedToken) {
        throw new Error("Authentication failed: No token received");
      }
      setToken(receivedToken);

      setSuccess(res.data.message);
      setFormData({ email: "", password: "" });
      connectSocket(receivedToken);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      if(error.response && error.response.status >= 400 && error.response.status < 500){
        setError(error.response.data);
      }else {
        console.log(error.message);
        setError("Something went wrong. Please try again.");
      }
    }
  }
  return (
    <div className="login-container">
      <h1>Welcome back</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input 
          type="text" 
          id="email" 
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <input 
          type="password" 
          name="password"
          id="password" 
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input type="submit" value="Login" id="login"/>
        { error && <p className="error" style={{color: "red"}}>{error}</p>}
        { success && <p className="error" style={{color: "green"}}>{success}</p>}
        <p className='no-account'>Don't have an account? <Link to="/register" className="sign-up-link">Sign up</Link></p>
        <p className='or'>OR</p>
        <input type="button" id="google" value="Continue with Google"/>
      </form>
    </div>
  )
}
export default Login;