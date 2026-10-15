import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, UserX, UserCheck, Shield } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get(`/admin/users?search=${search}&limit=50`)
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const toggleActive = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}`, { isActive: !user.isActive });
      toast.success(user.isActive ? 'User suspended' : 'User restored');
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const toggleAdmin = async (user) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await api.put(`/admin/users/${user._id}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="page-container">
      <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input w-48 text-sm"
            placeholder="Search name or email..." onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} />
          <button onClick={fetchUsers} className="btn-primary text-xs">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-16" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={user.role === 'admin' ? 'badge-pending' : 'badge-resolved'}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={user.isActive ? 'badge-approved' : 'badge-rejected'}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => toggleActive(user)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          user.isActive ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}>
                        {user.isActive ? <><UserX className="w-3.5 h-3.5" /> Suspend</> : <><UserCheck className="w-3.5 h-3.5" /> Restore</>}
                      </button>
                      <button onClick={() => toggleAdmin(user)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 transition-colors">
                        <Shield className="w-3.5 h-3.5" />
                        {user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
