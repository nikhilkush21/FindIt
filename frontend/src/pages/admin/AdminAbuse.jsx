import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, Eye } from 'lucide-react';

export default function AdminAbuse() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/abuse-reports?status=${filter}`)
      .then(({ data }) => setReports(data.reports))
      .finally(() => setLoading(false));
  }, [filter]);

  const resolve = async (id, status, action) => {
    try {
      await api.put(`/admin/abuse-reports/${id}`, { status, adminAction: action });
      toast.success('Report updated');
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="page-container">
      <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </Link>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Abuse Reports</h1>

      <div className="flex gap-2 mb-6">
        {['open', 'reviewed', 'resolved', 'dismissed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === f ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-24" />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No {filter} abuse reports</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-pending">{r.reason}</span>
                    {r.reportedItem && <span className="text-xs text-gray-400">Item report</span>}
                    {r.reportedUser && <span className="text-xs text-gray-400">User report</span>}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{r.details || 'No details provided'}</p>
                  <div className="text-xs text-gray-400">
                    Reporter: {r.reporter?.name} ({r.reporter?.email}) ·{' '}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {r.reportedItem && (
                    <Link to={`/items/${r.reportedItem._id}`} className="btn-ghost py-1.5 px-2 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {filter === 'open' && (
                    <>
                      <button onClick={() => resolve(r._id, 'resolved', 'Reviewed and actioned')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100">
                        <Check className="w-3.5 h-3.5" /> Resolve
                      </button>
                      <button onClick={() => resolve(r._id, 'dismissed', 'Not a violation')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-xs font-medium hover:bg-gray-100">
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
