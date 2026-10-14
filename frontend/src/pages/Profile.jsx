import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [passForm, setPassForm] = useState({ newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });

  useEffect(() => {
    api.get('/items/my').then(({ data }) => {
      setStats({ total: data.length, resolved: data.filter((i) => i.status === 'resolved').length });
    });
  }, []);

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', { name: form.name, phone: form.phone });
      updateUser(data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (passForm.newPass !== passForm.confirm) { toast.error('Passwords do not match'); return; }
    setPassLoading(true);
    try {
      await api.put('/auth/profile', { password: passForm.newPass });
      toast.success('Password updated');
      setPassForm({ newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setPassLoading(false);
    }
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Profile</h1>

      <div className="space-y-4">
        {/* Account info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-gray-900 text-white font-bold text-base flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <div className="ml-auto flex gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-400">Reports</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{stats.resolved}</p>
                <p className="text-xs text-gray-400">Resolved</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfile} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full name</label>
                <input type="text" required className="input" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" className="input" placeholder="+91 98765 43210"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input bg-gray-50 cursor-not-allowed" value={user.email} disabled />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div className="pt-1">
              <button type="submit" disabled={loading} className="btn-primary text-xs py-2 px-4">
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Change password</h2>
          <form onSubmit={handlePassword} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">New password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required className="input pr-9"
                    placeholder="Min. 6 characters" value={passForm.newPass}
                    onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm password</label>
                <input type={showPass ? 'text' : 'password'} required className="input"
                  placeholder="Repeat password" value={passForm.confirm}
                  onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })} />
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
