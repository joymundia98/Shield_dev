import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import headerLogo from "../../assets/headerlogo.png";

// Validation schema
const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const AdminAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  // Assuming the organization is passed as a state when redirected to this form
  const location = window.location.state as { organizationId: string };
  const organizationId = location ? location.organizationId : "";

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Submit registration data to the backend
      await axios.post("http://localhost:3000/api/auth/register", {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        position: "System Administrator", // Set position to System Administrator by default
        role_id: 1, // Set role to Admin (assuming 1 is the ID for Admin)
        organization_id: organizationId, // Use the organization ID from the URL state
        password: data.password,
        status: "active", // Set status to active
      });

      // Show success message and redirect to dashboard
      setShowSuccessCard(true);
      setTimeout(() => {
        setShowSuccessCard(false);
        navigate("/dashboard"); // Redirect to the dashboard page
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-parent-container">
      <div className="loginContainer">
        <div className="header">
          <img src={headerLogo} alt="Logo" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First Name */}
          <div className="field input-field">
            <input type="text" {...register("first_name")} />
            <label>First Name</label>
            {errors.first_name && <p className="form-error">{errors.first_name.message}</p>}
          </div>

          {/* Last Name */}
          <div className="field input-field">
            <input type="text" {...register("last_name")} />
            <label>Last Name</label>
            {errors.last_name && <p className="form-error">{errors.last_name.message}</p>}
          </div>

          {/* Email */}
          <div className="field input-field">
            <input type="email" {...register("email")} />
            <label>Email Address</label>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="field input-field">
            <input type="text" {...register("phone")} />
            <label>Phone</label>
            {errors.phone && <p className="form-error">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div className="field input-field">
            <input type={showPassword ? "text" : "password"} {...register("password")} />
            <label>Password</label>
            <span className="showPassword" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "👁️" : "🙈"}
            </span>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="field input-field">
            <input type={showConfirmPassword ? "text" : "password"} {...register("confirm_password")} />
            <label>Confirm Password</label>
            <span className="showPassword" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? "👁️" : "🙈"}
            </span>
            {errors.confirm_password && <p className="form-error">{errors.confirm_password.message}</p>}
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          {/* Submit Button */}
          <div className="field button-field">
            <button type="submit">Register</button>
          </div>

          {/* Login link */}
          <div className="form-link sign-up">
            <span>Already have an account?</span>
            <a href="/login"> Login here</a>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessCard && (
        <div className="success-card">
          <h3>✅ Registration Successful!</h3>
          <p>Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  );
};
