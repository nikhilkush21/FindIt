import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import MatchScoreCard from '../components/MatchScoreCard';
import { DetailSkeleton } from '../components/Skeleton';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import {
  MapPin, Calendar, Tag, User, Phone, Mail, Edit2, Trash2,
  ArrowLeft, Lock, Box, ChevronRight, Flag, X, Zap
} from 'lucide-react';

const claimSchema = z.object({
  message: z.string().min(10, 'Please describe your claim in at least 10 characters').max(1000),
  answer1: z.string().max(500).optional(),
});

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimDone, setClaimDone] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(claimSchema),
  });

  useEffect(() => {
    setLoading(true);
    api.get(`/items/${id}`)
      .then(({ data }) => {
        setItem(data);
        if (user) {
          api.get(`/items/${id}/matches`)
            .then(({ data: m }) => setMatches(m))
            .catch(() => {});
        }
      })
      .catch(() => navigate('/browse', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleDelete = async () => {
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

  const handleClaim = async (data) => {
    setClaimLoading(true);
    try {
      await api.post(`/items/${id}/claims`, {
        message: data.message,
        verificationAnswers: data.answer1
          ? [{ question: 'Additional verification', answer: data.answer1 }]
          : [],
      });
      toast.success('Claim submitted successfully');
      setClaimDone(true);
      setShowClaimForm(false);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleDismissMatch = async (matchId) => {
    try {
      await api.post(`/items/${id}/matches/${matchId}/dismiss`);
      setMatches((prev) => prev.filter((m) => m._id !== matchId));
    } catch {
      toast.error('Failed to dismiss');
    }
  };

  const handleReport = async () => {
    try {
      await api.post('/abuse-reports', { reportedItem: id, reason: 'fake' });
      toast.success('Report submitted. Thank you.');
      setShowReportDialog(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!item) return null;

  const isOwner = user && item.reportedBy._id === user._id;
  const date = new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const postedDate = new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const canClaim = user && !isOwner && item.status === 'open' && !claimDone;

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="md:col-span-3 space-y-4">
          {/* Images */}
          {item.images?.length > 0 ? (
            <div>
              <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-zoom-in h-72"
                onClick={() => setLightboxIdx(0)}>
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
              </div>
              {item.images.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {item.images.slice(1).map((img, i) => (
                    <button key={i} onClick={() => setLightboxIdx(i + 1)}
                      className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 border border-gray-200 h-56 flex items-center justify-center">
              <Box className="text-gray-300 w-12 h-12" strokeWidth={1} />
            </div>
          )}

          {/* Description */}
          <div className="card">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            {item.identifyingFeatures && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Identifying Features</p>
                <p className="text-sm text-gray-600">{item.identifyingFeatures}</p>
              </div>
            )}
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/items/${id}/edit`} className="btn-secondary flex-1 justify-center">
                <Edit2 className="w-4 h-4" /> Edit
              </Link>
              <button onClick={() => setShowDeleteDialog(true)} disabled={deleting}
                className="btn-danger flex-1 justify-center">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}

          {/* Claim form */}
          {canClaim && (
            <div className="card">
              {showClaimForm ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Submit a claim</h3>
                    <button onClick={() => setShowClaimForm(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Describe why this item belongs to you. Your verification answers are private and only visible to the reporter.
                  </p>
                  <form onSubmit={handleSubmit(handleClaim)} className="space-y-3">
                    <div>
                      <label className="label" htmlFor="message">Your claim *</label>
                      <textarea id="message" {...register('message')} rows={3}
                        className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                        placeholder="Explain why this item is yours — describe something only the owner would know..." />
                      {errors.message && <p className="error-msg">{errors.message.message}</p>}
                    </div>
                    <div>
                      <label className="label" htmlFor="answer1">
                        Verification detail
                        <span className="font-normal text-gray-400 ml-1">(optional but recommended)</span>
                      </label>
                      <input id="answer1" {...register('answer1')} className="input"
                        placeholder="e.g. serial number, receipt number, unique marking..." />
                    </div>
                    <button type="submit" disabled={claimLoading} className="btn-primary w-full py-2.5">
                      {claimLoading ? 'Submitting...' : 'Submit Claim'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Is this your item?</p>
                  <p className="text-xs text-gray-400 mb-3">Submit a claim and the reporter will review your details privately.</p>
                  <button onClick={() => setShowClaimForm(true)} className="btn-primary">
                    Submit a Claim <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {claimDone && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
              ✓ Your claim has been submitted. You'll be notified when the reporter reviews it.
            </div>
          )}

          {item.status !== 'open' && !isOwner && !claimDone && user && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              This item is marked as <strong>{item.status}</strong> and is no longer accepting new claims.
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-4">
          {/* Item info */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
                {item.type === 'lost' ? 'Lost' : 'Found'}
              </span>
              {item.status !== 'open' && (
                <span className={item.status === 'resolved' ? 'badge-resolved' : 'badge-claimed'}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{item.title}</h1>
            <div className="space-y-2.5">
              {[
                { icon: <Tag className="text-gray-400 w-4 h-4" />, label: item.category },
                { icon: <MapPin className="text-gray-400 w-4 h-4" />, label: item.location },
                { icon: <Calendar className="text-gray-400 w-4 h-4" />, label: date },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-gray-600">
                  {icon} {label}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">Posted {postedDate}</p>
          </div>

          {/* Reporter contact */}
          <div className="card">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Reported by</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <User className="text-gray-500 w-4 h-4" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">{item.reportedBy.name}</p>
            </div>

            {user ? (
              <div className="space-y-2">
                {item.reportedBy.email && (
                  <a href={`mailto:${item.reportedBy.email}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <Mail className="text-gray-400 w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.reportedBy.email}</span>
                  </a>
                )}
                {item.reportedBy.phone && (
                  <a href={`tel:${item.reportedBy.phone}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <Phone className="text-gray-400 w-4 h-4 flex-shrink-0" />
                    <span>{item.reportedBy.phone}</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                <Lock className="text-gray-300 w-5 h-5 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">Contact details hidden</p>
                <p className="text-xs text-gray-400 mb-3">Sign in to view reporter's email and phone</p>
                <div className="flex gap-2">
                  <Link to="/login" state={{ from: { pathname: `/items/${id}` } }} className="btn-primary flex-1 justify-center text-xs py-2">Sign in</Link>
                  <Link to="/register" className="btn-secondary flex-1 justify-center text-xs py-2">Register</Link>
                </div>
              </div>
            )}
          </div>

          {/* Safety tip */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">Safety tip</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Always meet in a public place or through a campus security office when exchanging items. Never share financial information.
            </p>
          </div>

          {/* Report abuse */}
          {user && !isOwner && (
            <button onClick={() => setShowReportDialog(true)}
              className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
              <Flag className="w-3 h-3" /> Report this listing
            </button>
          )}
        </div>
      </div>

      {/* AI Matches */}
      {matches.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">AI Potential Matches</h2>
          </div>
          <p className="text-sm text-gray-400 mb-5">
            These {item.type === 'lost' ? 'found' : 'lost'} items may be related to yours based on AI similarity analysis.
            Scores are a ranking tool only — they do not prove ownership.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {matches.map((m) => (
              <MatchScoreCard key={m._id} match={m} currentItemType={item.type} onDismiss={handleDismissMatch} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && item.images?.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}>
          <img src={item.images[lightboxIdx]} alt={item.title}
            className="max-w-full max-h-full rounded-lg object-contain" />
          <button className="absolute top-4 right-4 text-white bg-white/10 rounded-lg p-2 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete this report?"
        message="This will permanently remove the report and all associated matches. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <ConfirmDialog
        open={showReportDialog}
        title="Report this listing?"
        message="We'll review this report and take action if it violates our policies. Thank you for helping keep FindIt safe."
        confirmLabel="Submit Report"
        variant="warning"
        onConfirm={handleReport}
        onCancel={() => setShowReportDialog(false)}
      />
    </div>
  );
}
