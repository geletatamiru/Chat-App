import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { signupApi } from "../../services/authApi";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { signupSchema } from "../validation/authSchema";
import { ThreeDot } from "react-loading-indicators";
import z from "zod";
import "./Signup.css"; 

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {setEmailForVerification} = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      signupSchema.parse(formData);

      await signupApi(formData);
      setEmailForVerification(formData.email);
      setFormData({ username: "", email: "", password: "" });
      navigate('/verify');
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].message);
      }else if(error.response && error.response.status >= 400 && error.response.status < 500){
        setError(error.response.data.message);
      }else {
        setError("Something went wrong. Please try again.");
      }
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className="signup-container">
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <Input 
          type="text" 
          id="username" 
          placeholder="Username" 
          onChange={handleChange}
          value={formData.username}
        />
        <Input 
          type="text" 
          id="email" 
          placeholder="Email address" 
          onChange={handleChange}
          value={formData.email}
        />
        <Input 
          type="password" 
          id="password" 
          placeholder="Password" 
          onChange={handleChange}
          value={formData.password}
        />
        <button type="submit" id="signup" disabled={loading}>
          {loading ? (
            <ThreeDot color="white" size="medium" text="" textColor="" />
          ) : (
            "Signup"
          )}
        </button>
        { error && <p className="error" style={{color: "red"}}>{error}</p>}
        <p className="no-account">Already have an account? <Link to="/login" className="login-link">Login</Link></p>
        <p className="or">OR</p>
        <Link to="http://localhost:5000/auth/google" id="google">Continue with Google</Link>
      </form>
    </div>
  )
}
export default Signup;