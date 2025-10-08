import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyEmail } from '../../services/authApi';
import "./VerificationPage.css";

const VerificationPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const {emailForVerfication} = useAuth();

  if(!emailForVerfication) {
    navigate('/signup');
  }
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await verifyEmail(emailForVerfication, code);
      setSuccess(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000)
    } catch (error) {
      if(error.response && error.response.status >= 400 && error.response.status < 500){
        setError(error.response.data.message);
      }else {
        setError("Something went wrong.Verification Failed.");
      }
    }finally {
      setLoading(false);
    }
  }
  
  return (
    <div className='verify-container'>
      <div className="verify-card">
        <h2>Verify Your Email</h2>
        <p>Enter the 6-digit code sent to {emailForVerfication}</p>
        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            placeholder='Enter 6-digit code' 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            required
          />
          <button type='submit' disabled={loading}>{loading ? "Verifying" : "Verify"}</button>
        </form>
        { error && <p className="error">{error}</p>}
        { success && <p className="success">{success}</p>}
      </div>
    </div>
  )
}

export default VerificationPage;