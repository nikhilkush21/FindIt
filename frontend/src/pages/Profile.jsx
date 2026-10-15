import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().max(20).optional(),
  bio: z.string().max(300).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirm: z.string().min(1),
}).refine((d) => d.newPassword === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: pe } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone || '', bio: user.bio || '' },
  });

  const { register: regPass, handleSubmit: handlePass, formState: { errors: pse }, reset: resetPass } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfile = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await api.put('/auth/me', data);
      updateUser(res.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onPassword = async (data) => {
    setPassLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated');
      resetPass();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-container-sm">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Profile & Settings</h1>

      <div className="space-y-4">
        {/* Account card */}
        <div className="card">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-gray-900 text-white font-bold text-base flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                  Administrator
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleProfile(onProfile)} className="space-y-3" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="name">Full name</label>
                <input id="name" type="text" {...regProfile('name')} className={`input ${pe.name ? 'input-error' : ''}`} />
                {pe.name && <p className="error-msg">{pe.name.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" type="tel" {...regProfile('phone')} className="input" placeholder="+91 98765 43210" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="bio">Bio</label>
              <textarea id="bio" {...regProfile('bio')} rows={2} className="input resize-none" placeholder="Tell others a bit about yourself..." />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" value={user.email} disabled className="input bg-gray-50 cursor-not-allowed text-gray-400" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary text-xs py-2 px-4">
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Password card */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Change password</h2>
          <form onSubmit={handlePass(onPassword)} className="space-y-3" noValidate>
            <div>
              <label className="label" htmlFor="currentPassword">Current password</label>
              <input id="currentPassword" type="password" {...regPass('currentPassword')}
                className={`input ${pse.currentPassword ? 'input-error' : ''}`} placeholder="Your current password" />
              {pse.currentPassword && <p className="error-msg">{pse.currentPassword.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="newPassword">New password</label>
                <div className="relative">
                  <input id="newPassword" type={showPass ? 'text' : 'password'} {...regPass('newPassword')}
                    className={`input pr-9 ${pse.newPassword ? 'input-error' : ''}`} placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pse.newPassword && <p className="error-msg">{pse.newPassword.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="confirm">Confirm</label>
                <input id="confirm" type={showPass ? 'text' : 'password'} {...regPass('confirm')}
                  className={`input ${pse.confirm ? 'input-error' : ''}`} placeholder="Repeat password" />
                {pse.confirm && <p className="error-msg">{pse.confirm.message}</p>}
              </div>
            </div>
            <button type="submit" disabled={passLoading} className="btn-secondary text-xs py-2 px-4">
              {passLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
