// client/src/components/Auth/orgLogin.tsx
import './LoginForm.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import headerLogo from '../../assets/headerlogo.png';

const orgLoginSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type OrgLoginFormData = z.infer<typeof orgLoginSchema>;

export const OrgLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const { register, handleSubmit } = useForm<OrgLoginFormData>({
    resolver: zodResolver(orgLoginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: OrgLoginFormData) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/organizations', {
        accountId: data.accountId.trim(),
        password: data.password.trim(),
      });

      // Assuming backend returns a JSON with success status and maybe organization info
      console.log('Login response:', response.data);

      if (response.data.success) {
        setShowSuccessCard(true);
        setTimeout(() => {
          setShowSuccessCard(false);
          navigate('/dashboard', { state: { org: response.data.organization } });
        }, 2000);
      } else {
        setError(response.data.message || 'Invalid credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Organization login failed.');
      } else {
        setError('Organization login failed.');
      }
    }
  };

  const handleUserLogin = () => {
    navigate('/login'); // redirect to user login page
  };

  return (
    <div className="login-parent-container">
      <div className="loginContainer">
        <div className="header">
          <img src={headerLogo} alt="Logo" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Account ID */}
          <div className="field input-field">
            <input type="text" required {...register('accountId')} />
            <label>Account ID</label>
          </div>

          {/* Password */}
          <div className="field input-field">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              {...register('password')}
            />
            <label>Password</label>
            <span
              className="showPassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          {/* Error Message */}
          {error && <div className="form-error">{error}</div>}

          {/* Forgot Password */}
          <div className="form-link">
            <a href="#" className="forgot-pass">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div className="field button-field">
            <button type="submit">Login</button>
          </div>

          {/* Registration Link */}
          <div className="form-link sign-up">
            <span>Register Organization instead?</span>
            <a href="/org-register"> Register now!</a>
          </div>
        </form>
      </div>

      {/* Switch to User Login */}
      <div className="switchLogin">
        <button type="button" className="orgLogin" onClick={handleUserLogin}>
          <div className="orgLogin-outer">
            <div className="orgLogin-inner">
              <span>Login as User 👤</span>
            </div>
          </div>
        </button>
      </div>

      {/* Success Card */}
      {showSuccessCard && (
        <div className="success-card">
          <h3>✅ Login Successful!</h3>
          <p>Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  );
};
