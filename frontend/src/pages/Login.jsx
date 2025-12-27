import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext.jsx';

const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  return requirements;
};

const isPasswordValid = (password) => {
  const reqs = validatePassword(password);
  return Object.values(reqs).every(v => v === true);
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const passwordReqs = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        // Validate password requirements
        if (!isPasswordValid(password)) {
          setError('Password must have uppercase, lowercase, special character, and 8+ characters');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // For now, show a simple alert. In production, you'd send a reset email
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    alert('Password reset link sent to ' + email + '\n(Demo: Check your email)');
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">⚙️ GearGuard</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        {showForgotPassword ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              onClick={handleForgotPassword}
              className="w-full btn btn-primary"
            >
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full btn btn-secondary"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                  required
                />
                <p className="text-xs text-gray-500 mb-2">Account Type: User (read-only, no admin access)</p>
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            
            {isRegister && (
              <>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                  required
                />
                
                {/* Password Requirements Checklist */}
                <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                  <p className="font-semibold mb-2">Password Requirements:</p>
                  <div className="space-y-1">
                    <p className={passwordReqs.length ? 'text-green-600' : 'text-gray-600'}>
                      {passwordReqs.length ? '✓' : '○'} At least 8 characters
                    </p>
                    <p className={passwordReqs.uppercase ? 'text-green-600' : 'text-gray-600'}>
                      {passwordReqs.uppercase ? '✓' : '○'} Uppercase letter (A-Z)
                    </p>
                    <p className={passwordReqs.lowercase ? 'text-green-600' : 'text-gray-600'}>
                      {passwordReqs.lowercase ? '✓' : '○'} Lowercase letter (a-z)
                    </p>
                    <p className={passwordReqs.special ? 'text-green-600' : 'text-gray-600'}>
                      {passwordReqs.special ? '✓' : '○'} Special character (!@#$%^&*)
                    </p>
                  </div>
                </div>
              </>
            )}
            
            <button
              type="submit"
              disabled={loading || (isRegister && !isPasswordValid(password))}
              className="w-full btn btn-primary"
            >
              {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Create Account' : 'Login')}
            </button>
          </form>
        )}
        
        {!showForgotPassword && (
          <div className="mt-4 space-y-2">
            <p className="text-center text-gray-600">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 hover:underline font-semibold"
              >
                {isRegister ? 'Login' : 'Sign Up'}
              </button>
            </p>
            {!isRegister && (
              <p className="text-center text-gray-600">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
