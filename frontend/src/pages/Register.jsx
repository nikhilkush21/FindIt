import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Search } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().max(20).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ name, email, password, phone }) => {
    setLoading(true);
    try {
      await registerUser(name, email, password, phone || '');
      toast.success('Account created! Welcome to FindIt.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
            <Search className="text-white w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900">FindIt</span>
        </Link>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 font-medium hover:underline">Sign in</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" type="text" {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Jane Doe" autoComplete="name" />
            {errors.name && <p className="error-msg">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email address</label>
            <input id="email" type="email" {...register('email')} className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com" autoComplete="email" />
            {errors.email && <p className="error-msg">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="phone" type="tel" {...register('phone')} className="input"
              placeholder="+91 98765 43210" autoComplete="tel" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPass ? 'text' : 'password'} {...register('password')}
                className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                placeholder="Min. 6 characters" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm password</label>
            <input id="confirm" type={showPass ? 'text' : 'password'} {...register('confirm')}
              className={`input ${errors.confirm ? 'input-error' : ''}`} placeholder="Repeat password" />
            {errors.confirm && <p className="error-msg">{errors.confirm.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
