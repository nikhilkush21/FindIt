import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, FileText, CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-container animate-pulse">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 h-24" />
        ))}
      </div>
    </div>
  );

  const cards = stats ? [
    { icon: <Users className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', label: 'Total Users', value: stats.users.total, sub: `${stats.users.active} active` },
    { icon: <FileText className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50', label: 'Total Reports', value: stats.items.total, sub: `${stats.items.lost} lost · ${stats.items.found} found` },
    { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', label: 'Resolved', value: stats.items.resolved, sub: `${stats.items.open} still open` },
    { icon: <Clock className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50', label: 'Pending Moderation', value: stats.items.pendingModeration, sub: 'Awaiting review', alert: stats.items.pendingModeration > 0 },
    { icon: <Shield className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', label: 'Total Claims', value: stats.claims.total, sub: `${stats.claims.pending} pending · ${stats.claims.approved} approved` },
    { icon: <AlertTriangle className="w-5 h-5 text-red-600" />, bg: 'bg-red-50', label: 'Open Abuse Reports', value: stats.abuse.open, sub: 'Awaiting review', alert: stats.abuse.open > 0 },
  ] : [];

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">Platform overview and moderation</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(({ icon, bg, label, value, sub, alert }) => (
          <div key={label} className={`card ${alert ? 'border-amber-200 bg-amber-50/30' : ''}`}>
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/items', label: 'Moderate Items', desc: 'Review and approve or reject reports', icon: <FileText className="w-5 h-5" /> },
          { to: '/admin/users', label: 'Manage Users', desc: 'View, suspend, or promote users', icon: <Users className="w-5 h-5" /> },
          { to: '/admin/abuse', label: 'Abuse Reports', desc: 'Review flagged content and users', icon: <AlertTriangle className="w-5 h-5" /> },
        ].map(({ to, label, desc, icon }) => (
          <Link key={to} to={to} className="card hover:border-gray-300 hover:shadow-sm transition-all group">
            <div className="text-gray-400 group-hover:text-gray-700 mb-3 transition-colors">{icon}</div>
            <p className="font-semibold text-gray-900 mb-1">{label}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
