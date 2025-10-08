import {useState} from 'react';
import "./ForgotPassword.css";
import { forgotPassword } from '../../services/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await forgotPassword(email);
      setSuccess(data.message);
    } catch (error) {
      if(error.response && error.response.status >= 400 && error.response.status < 500){
        setError(error.response?.data.message);
      }else {
        setError("Something went wrong. please try again.");
      }
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className='forgot-password-container'>
      <div className="forgot-password-card">
        <h2>Forgot Your Password</h2>
        <p>Enter your email and we will send you an email to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder='Enter your email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <button type='submit' disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
        </form>
        { error && <p className="error">{error}</p>}
        { success && <p className="success">{success}</p>}
      </div>
    </div>
  )
}

export default ForgotPassword;