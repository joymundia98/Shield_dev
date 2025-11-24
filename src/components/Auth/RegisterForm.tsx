import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';

const registerSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  org_type: z.enum(['church', 'ngo']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const { login } = useAuth();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await registerUser(data);
      login(res.token, res.user);
      alert('Registration successful!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="Full Name" {...register('full_name')} />
      <input type="email" placeholder="Email" {...register('email')} />
      <input type="password" placeholder="Password" {...register('password')} />
      <select {...register('org_type')}>
        <option value="church">Church</option>
        <option value="ngo">NGO</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};
