import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
// import { connectSocket } from '../../socket/socket';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import { resendVerification } from '../../services/authApi';
import { loginSchema } from '../validation/authSchema';
import { ThreeDot } from 'react-loading-indicators';
import {z} from "zod";
import "./Login.css"; 

const Login = () => {
  const { login, setEmailForVerification } = useAuth();
  const [formData, setFormData] = useState({email: "", password: ""});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationButton, setShowVerificationButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await resendVerification(formData.email);
      setEmailForVerification(formData.email);
      navigate("/verify");
    } catch (error) {
      if(error.response && error.response.status >= 400 && error.response.status < 500){
        setError(error.response?.data.message);
      }else {
        setError("Something went wrong. Please try again.");
      }
    }finally{
      setIsLoading(false);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      loginSchema.parse(formData);

      await login(formData);
      setFormData({ email: "", password: "" });
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        setError(error.issues[0].message);
      }else if(error.response && error.response.status >= 400 && error.response.status < 500){
        if(error.response.status === 403){
          setEmailForVerification(formData.email);
          setShowVerificationButton(true);
        }
          
        setError(error.response?.data.message);
      }else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="login-container">
      <h1>Welcome back</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <Input 
          type="text" 
          id="email" 
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <Input 
          type="password" 
          name="password"
          id="password" 
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit" id="login" disabled={loading}>
          {loading ? (
            <ThreeDot color="white" size="medium" text="" textColor="" />
          ) : (
            "Login"
          )}
        </button>
        { error && <p className="error" style={{color: "red"}}>{error}</p>}
        { showVerificationButton && <button className='resend-button' type="button" onClick={handleResend} disabled={isLoading}>{`${isLoading ? 'Resending...' : 'Resend Verification'}`}</button>}
        <Link to="/forgot-password" className='forgot-password'>Forgot Password?</Link>
        <p className='no-account'>Don't have an account? <Link to="/signup" className="sign-up-link">Sign up</Link></p>
        <p className='or'>OR</p>
        <a href={`${import.meta.env.VITE_BASE_URL}/api/auth/google`} id="google">Continue with Google</a>
      </form>
    </div>
  )
}
export default Login;