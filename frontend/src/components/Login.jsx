import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { requestOTP, verifyOTP, error } = useAuth();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setMessage('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      await requestOTP(phone);
      setMessage('OTP sent successfully! Check your phone.');
      setStep('otp');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      await verifyOTP(phone, otp);
      // Auth context will update and App will re-render
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>🏥 Hospital Management System</h2>
          <p>Sign in to continue</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleRequestOTP}>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`message ${error ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
                disabled={loading}
              />
              <small>OTP sent to +91 {phone}</small>
            </div>

            {message && (
              <div className={`message ${error ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button type="button" className="btn-back" onClick={handleBack} disabled={loading}>
              ← Change Phone Number
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>For demo: Use any 10-digit phone number</p>
          <p className="api-status">
            Backend API: <span className="status-dot">●</span> http://localhost:5000
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
