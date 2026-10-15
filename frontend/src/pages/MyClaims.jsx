import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Calendar, ChevronRight, X } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
  withdrawn: 'badge-resolved',
};

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawId, setWithdrawId] = useState(null);

  useEffect(() => {
    api.get('/claims/my')
      .then(({ data }) => setClaims(data))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async () => {
    try {
      await api.delete(`/claims/${withdrawId}`);
      toast.success('Claim withdrawn');
      setClaims((prev) => prev.map((c) => c._id === withdrawId ? { ...c, status: 'withdrawn' } : c));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    } finally {
      setWithdrawId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">My Claims</h1>
        <p className="text-sm text-gray-400">Track the status of claims you've submitted</p>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-24" />
          ))}
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="font-medium text-gray-700">No claims yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Browse found items and submit a claim if you recognise your item.</p>
          <Link to="/browse?type=found" className="btn-primary text-sm">Browse found items</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div key={claim._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {claim.item?.images?.[0]
                      ? <img src={claim.item.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                      : <div className="w-full h-full bg-gray-100" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={STATUS_COLORS[claim.status] || 'badge-pending'}>{claim.status}</span>
                      {claim.item?.type && (
                        <span className={claim.item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
                          {claim.item.type}
                        </span>
                      )}
                    </div>
                    <Link to={`/items/${claim.item?._id}`}
                      className="font-semibold text-gray-900 hover:text-gray-600 text-sm truncate block">
                      {claim.item?.title || 'Item'}
                    </Link>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      {claim.item?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-300" />{claim.item.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-300" />
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {claim.reviewNote && (
                      <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded px-2 py-1">
                        Reviewer note: {claim.reviewNote}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/items/${claim.item?._id}`} className="btn-ghost py-1.5 px-2 text-xs">
                    View <ChevronRight className="w-3 h-3" />
                  </Link>
                  {claim.status === 'pending' && (
                    <button onClick={() => setWithdrawId(claim._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Withdraw claim">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!withdrawId}
        title="Withdraw this claim?"
        message="You can submit a new claim later if needed."
        confirmLabel="Withdraw"
        onConfirm={handleWithdraw}
        onCancel={() => setWithdrawId(null)}
      />
    </div>
  );
}
