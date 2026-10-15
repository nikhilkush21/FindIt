import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/axios';
import { Search, Mail } from 'lucide-react';

const schema = z.object({ email: z.string().email('Invalid email') });

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      if (data.devToken) setDevToken(data.devToken);
    } catch (err) {
      // Still show success to prevent email enumeration
      setSent(true);
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

        {sent ? (
          <div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 mb-4">
              If that email is registered, we sent a password reset link. Check your inbox and spam folder.
            </p>
            {devToken && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">Development mode — reset token:</p>
                <code className="text-xs text-amber-800 break-all">{devToken}</code>
                <p className="text-xs text-amber-600 mt-1">
                  Use this at <Link to={`/reset-password?token=${devToken}`} className="underline">/reset-password</Link>
                </p>
              </div>
            )}
            <Link to="/login" className="btn-secondary w-full justify-center">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h1>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email and we'll send a reset link.{' '}
              <Link to="/login" className="text-gray-900 font-medium hover:underline">Back to sign in</Link>
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
              <div>
                <label className="label" htmlFor="email">Email address</label>
                <input id="email" type="email" {...register('email')} className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com" autoComplete="email" />
                {errors.email && <p className="error-msg">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
