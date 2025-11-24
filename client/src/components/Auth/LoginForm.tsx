import './LoginForm.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom'; // for navigation
import headerLogo from '../../assets/headerlogo.png';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Default simulated credentials
const DEFAULT_EMAIL = 'shield@devtest.com';
const DEFAULT_PASSWORD = 'SCI-ELD';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // To display invalid credentials

  const { register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: LoginFormData) => {
    // Check against default credentials
    if (data.email === DEFAULT_EMAIL && data.password === DEFAULT_PASSWORD) {
      setError('');
      alert('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-parent-container">
      <div className="loginContainer">
        <div className="header">
          <img src={headerLogo} alt="Logo" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="field input-field">
            <input type="email" required {...register('email')} />
            <label>Email Address</label>
          </div>

          {/* Password Field */}
          <div className="field input-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
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

          {/* Signup Link */}
          <div className="form-link sign-up">
            <span>Don't have an account?</span>
            <a href="/register"> Sign up now</a>
          </div>
        </form>
      </div>
    </div>
  );
};
