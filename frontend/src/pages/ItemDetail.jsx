import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { DetailSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiTag, FiUser, FiPhone, FiMail, FiEdit2, FiTrash2, FiArrowLeft, FiLock, FiBox } from 'react-icons/fi';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/items/${id}`)
      .then(({ data }) => {
        setItem(data);
        if (user) api.get(`/items/${id}/suggestions`).then(({ data: s }) => setSuggestions(s));
      })
      .catch(() => navigate('/browse'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this report?')) return;
    setDeleting(true);
    try {
      await api.delete(`/items/${id}`);
      toast.success('Report deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!item) return null;

  const isOwner = user && item.reportedBy._id === user._id;
  const date = new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const postedDate = new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <FiArrowLeft className="text-sm" /> Back
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left */}
        <div className="md:col-span-3 space-y-4">
          <div className={`rounded-xl overflow-hidden bg-gray-100 border border-gray-200 ${item.image ? 'cursor-zoom-in' : ''}`}
            onClick={() => item.image && setLightbox(true)}>
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-72 object-cover" />
            ) : (
              <div className="w-full h-56 flex items-center justify-center">
                <FiBox className="text-gray-300 text-5xl" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/items/${id}/edit`} className="btn-secondary flex-1 justify-center text-sm">
                <FiEdit2 className="text-sm" /> Edit
              </Link>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 justify-center text-sm">
                <FiTrash2 className="text-sm" /> {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
                {item.type === 'lost' ? 'Lost' : 'Found'}
              </span>
              {item.status === 'resolved' && <span className="badge-resolved">Resolved</span>}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{item.title}</h1>
            <div className="space-y-2.5">
              {[
                { icon: <FiTag className="text-gray-400 text-sm" />, label: item.category },
                { icon: <FiMapPin className="text-gray-400 text-sm" />, label: item.location },
                { icon: <FiCalendar className="text-gray-400 text-sm" />, label: date },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-gray-600">
                  {icon} {label}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">Posted {postedDate}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Reported by</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FiUser className="text-gray-500 text-sm" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">{item.reportedBy.name}</p>
            </div>

            {user ? (
              <div className="space-y-2">
                <a href={`mailto:${item.reportedBy.email}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700 group">
                  <FiMail className="text-gray-400 text-sm flex-shrink-0" />
                  <span className="truncate">{item.reportedBy.email}</span>
                </a>
                {item.reportedBy.phone && (
                  <a href={`tel:${item.reportedBy.phone}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <FiPhone className="text-gray-400 text-sm flex-shrink-0" />
                    <span>{item.reportedBy.phone}</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                <FiLock className="text-gray-300 text-xl mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">Contact details hidden</p>
                <p className="text-xs text-gray-400 mb-3">Sign in to view email and phone</p>
                <div className="flex gap-2">
                  <Link to="/login" className="btn-primary flex-1 justify-center text-xs py-2">Sign in</Link>
                  <Link to="/register" className="btn-secondary flex-1 justify-center text-xs py-2">Register</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-12">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Possible matches</h2>
            <p className="text-sm text-gray-400 mt-0.5">{suggestions.length} similar item{suggestions.length > 1 ? 's' : ''} found</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {suggestions.map((s) => <ItemCard key={s._id} item={s} />)}
          </div>
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <img src={item.image} alt={item.title} className="max-w-full max-h-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
