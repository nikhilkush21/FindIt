import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, X, Eye, MapPin, Calendar } from 'lucide-react';

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchItems = () => {
    setLoading(true);
    api.get(`/admin/items?moderation=${filter}&page=${page}&limit=20`)
      .then(({ data }) => { setItems(data.items); setPages(data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(fetchItems, [filter, page]);

  const moderate = async (id, status, note = '') => {
    try {
      await api.put(`/admin/items/${id}/moderate`, { moderationStatus: status, moderationNote: note });
      toast.success(`Item ${status}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="page-container">
      <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </Link>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Item Moderation</h1>

      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected'].map((f) => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === f ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-28" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No {filter} items</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.images?.[0]
                  ? <img src={item.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                  : <div className="w-full h-full bg-gray-100" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>{item.type}</span>
                  <span className="text-xs text-gray-400">{item.category}</span>
                </div>
                <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span>by {item.reportedBy?.name}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link to={`/items/${item._id}`} className="btn-ghost py-1.5 px-2 text-xs">
                  <Eye className="w-3.5 h-3.5" />
                </Link>
                {filter === 'pending' && (
                  <>
                    <button onClick={() => moderate(item._id, 'approved')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => moderate(item._id, 'rejected', 'Policy violation')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {filter !== 'pending' && (
                  <button onClick={() => moderate(item._id, filter === 'approved' ? 'rejected' : 'approved')}
                    className="btn-secondary text-xs py-1.5 px-2.5">
                    {filter === 'approved' ? 'Reject' : 'Approve'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium ${p === page ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
