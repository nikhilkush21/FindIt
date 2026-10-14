import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiTrash2, FiPlus, FiMapPin, FiCalendar, FiEye, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    api.get('/items/my').then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Deleted');
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const lost = items.filter((i) => i.type === 'lost');
  const found = items.filter((i) => i.type === 'found');
  const resolved = items.filter((i) => i.status === 'resolved');
  const open = items.filter((i) => i.status === 'open');
  const filtered = { all: items, open, lost, found, resolved }[tab] || items;

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-900 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400">{user.name}</p>
          </div>
        </div>
        <Link to="/report" className="btn-primary text-xs py-2 px-3">
          <FiPlus strokeWidth={2.5} /> New report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', count: items.length },
          { label: 'Lost', count: lost.length },
          { label: 'Found', count: found.length },
          { label: 'Resolved', count: resolved.length },
        ].map(({ label, count }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-1 w-fit mb-5">
        {[
          { key: 'all', label: 'All' },
          { key: 'open', label: 'Open' },
          { key: 'lost', label: 'Lost' },
          { key: 'found', label: 'Found' },
          { key: 'resolved', label: 'Resolved' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FiBox className="text-gray-300 text-3xl mx-auto mb-3" />
          <p className="font-medium text-gray-700 text-sm">No reports here</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            {tab === 'all' ? "You haven't submitted any reports yet." : `No ${tab} reports.`}
          </p>
          {tab === 'all' && <Link to="/report" className="btn-primary text-xs">Report an item</Link>}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors p-3.5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                {item.image
                  ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  : <FiBox className="text-gray-300 text-lg" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>{item.type}</span>
                  {item.status === 'resolved' && <span className="badge-resolved">resolved</span>}
                </div>
                <Link to={`/items/${item._id}`}
                  className="font-medium text-gray-900 hover:text-gray-600 transition-colors truncate block text-sm">
                  {item.title}
                </Link>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiMapPin className="text-gray-300" />{item.location}</span>
                  <span className="flex items-center gap-1"><FiCalendar className="text-gray-300" />{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Link to={`/items/${item._id}`} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiEye className="text-sm" />
                </Link>
                <Link to={`/items/${item._id}/edit`} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiEdit2 className="text-sm" />
                </Link>
                <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
