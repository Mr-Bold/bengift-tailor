import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { authAPI } from '../services/api';
import { showToast } from '../utils/toast';
import logo from '/images/LOGO WINE.png';

function Login() {
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [loadingStep, setLoadingStep] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetData, setResetData] = useState({ username: '', email: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setCaptchaAnswer('');
  };

  useEffect(() => {
    if (showCaptcha) {
      generateCaptcha();
    }
  }, [showCaptcha]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setShowCaptcha(false);
    setLoginAttempts(0);
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: '',
      rememberMe: false
    });
  };

  const validateRegistration = () => {
    if (!formData.fullName.trim()) {
      setError('Full name cannot be empty');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username cannot be empty');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('.')) {
      setError('Please enter a valid email with a dot (.)');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) {
      showToast.error(error);
      return;
    }

    setLoading(true);
    setLoadingStep('Creating your account...');

    try {
      const response = await authAPI.register({
        username: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        role: 'user'
      });

      if (response.success) {
        localStorage.setItem('lastLoginTime', new Date().toISOString());
        showToast.success('Registration successful! Welcome to BenGift Clothing.');
        setTimeout(() => navigate('/'), 500);
      } else {
        const errorMsg = response.message || 'Registration failed';
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (showCaptcha && parseInt(captchaAnswer) !== captchaQuestion.answer) {
      setError('Incorrect CAPTCHA. Please try again.');
      generateCaptcha();
      return;
    }

    setLoading(true);
    setLoadingStep('Authenticating...');

    try {
      const response = await authAPI.login(formData.username, formData.password);
      
      if (response.success) {
        localStorage.setItem('lastLoginTime', new Date().toISOString());
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        showToast.success('Login successful! Welcome back.');
        setTimeout(() => navigate('/'), 500);
      } else {
        handleFailedLogin();
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      handleFailedLogin();
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleFailedLogin = () => {
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    localStorage.setItem('loginAttempts', attempts.toString());

    if (attempts >= 3) {
      setShowCaptcha(true);
      showToast.warning('Multiple failed attempts detected. Please complete the CAPTCHA.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      handleRegister(e);
    } else {
      handleLogin(e);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setError('');
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!resetData.username.trim()) {
      showToast.error('Username cannot be empty');
      return;
    }
    if (!resetData.email.trim() || !resetData.email.includes('.')) {
      showToast.error('Please enter a valid email with a dot (.)');
      return;
    }
    if (!resetData.newPassword || resetData.newPassword.length < 6) {
      showToast.error('Password must be at least 6 characters long');
      return;
    }
    if (resetData.newPassword !== resetData.confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword(
        resetData.username,
        resetData.email,
        resetData.newPassword
      );
      
      if (response.success) {
        showToast.success('Password reset successfully! You can now login with your new password.');
        setShowForgotPassword(false);
        setResetData({ username: '', email: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast.error(response.message || 'Password reset failed');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      showToast.error(err.response?.data?.message || 'Password reset failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      {/* Left Side - Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="logo-section">
            <img src={logo} alt="BenGift Clothing" className="welcome-logo" />
          </div>
          <h1 className="welcome-title">Welcome!</h1>
          <div className="welcome-divider"></div>
          <p className="welcome-text">
            Manage your tailoring business with ease. Track orders, customers, and workers all in one place.
          </p>
          <button className="learn-more-btn" onClick={toggleMode}>
            {isRegisterMode ? 'Already have an account?' : 'Create New Account'}
          </button>
        </div>
        <div className="decorative-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="signin-section">
        <div className="signin-card">
          <h2 className="signin-title">{isRegisterMode ? 'Sign Up' : 'Sign In'}</h2>

          <form className="signin-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {isRegisterMode && (
              <>
                <div className="form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <div className="form-field">
              <label>User Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={isRegisterMode ? "Choose a username" : "TechTree"}
                required
                disabled={loading}
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <div className="form-field">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            )}

            {!isRegisterMode && (
              <div className="form-options">
                <label className="remember-checkbox">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>Forgot Password?</a>
              </div>
            )}

            {!isRegisterMode && showCaptcha && (
              <div className="captcha-field">
                <label>Security Check: {captchaQuestion.num1} + {captchaQuestion.num2} = ?</label>
                <div className="captcha-input-wrapper">
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Answer"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="refresh-captcha-btn"
                    onClick={generateCaptcha}
                  >
                    🔄
                  </button>
                </div>
              </div>
            )}

            {!isRegisterMode && loginAttempts > 0 && loginAttempts < 5 && (
              <div className="attempts-alert">
                ⚠️ {5 - loginAttempts} attempts remaining
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  {loadingStep || (isRegisterMode ? 'Creating Account...' : 'Signing In...')}
                </>
              ) : (
                isRegisterMode ? 'Create Account' : 'Submit'
              )}
            </button>
          </form>

          <div className="social-login">
            <div className="social-divider">
              <span>Or connect with</span>
            </div>
            <div className="social-icons">
              <button className="social-btn facebook" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="social-btn instagram" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
              <button className="social-btn pinterest" title="Pinterest">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close" onClick={() => setShowForgotPassword(false)}>✕</button>
            </div>
            <form onSubmit={handlePasswordReset}>
              <div className="modal-body">
                <p>Enter your username, email, and new password to reset your account.</p>
                <div className="form-field">
                  <label>Username</label>
                  <input
                    type="text"
                    value={resetData.username}
                    onChange={(e) => setResetData({...resetData, username: e.target.value})}
                    placeholder="Your username"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={resetData.email}
                    onChange={(e) => setResetData({...resetData, email: e.target.value})}
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                    placeholder="At least 6 characters"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                    placeholder="Re-enter new password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowForgotPassword(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
