import {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/authApi';
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {token} = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!token){
      setError("Invalid Token");
      return;
    }
    if(newPassword !== confirmPassword) {
      setError("The password are not the same.")
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await resetPassword(token, newPassword);
      setSuccess(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000)
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
    <div className='reset-password-container'>
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder='New Password' 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder='Confirm Password' 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
          />

          <button type='submit' disabled={loading}>{loading ? "Reseting..." : "Reset"}</button>
        </form>
        { error && <p className="error">{error}</p>}
        { success && <p className="success">{success}</p>}
      </div>
    </div>
  )
}

export default ResetPassword;