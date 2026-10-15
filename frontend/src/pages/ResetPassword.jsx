import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string().min(1),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    if (!token) { toast.error('Invalid reset link'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.');
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
        <h1 className="text-xl font-bold text-gray-900 mb-1">Set new password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter and confirm your new password below.</p>

        {!token ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-4">Invalid or missing reset token.</p>
            <Link to="/forgot-password" className="btn-primary">Request a new link</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <div>
              <label className="label" htmlFor="password">New password</label>
              <div className="relative">
                <input id="password" type={showPass ? 'text' : 'password'} {...register('password')}
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`} placeholder="Min. 6 characters" />
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
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
