import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Search } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
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

        <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gray-900 font-medium hover:underline">Create one</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div>
            <label className="label" htmlFor="email">Email address</label>
            <input id="email" type="email" {...register('email')} className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com" autoComplete="email" />
            {errors.email && <p className="error-msg">{errors.email.message}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-800">Forgot password?</Link>
            </div>
            <div className="relative">
              <input id="password" type={showPass ? 'text' : 'password'} {...register('password')}
                className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
