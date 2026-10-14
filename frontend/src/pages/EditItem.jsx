import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ItemForm from '../components/ItemForm';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';

export default function EditItem() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/items/${id}`).then(({ data }) => {
      if (data.reportedBy._id !== user._id) { toast.error('Not authorized'); navigate('/dashboard'); return; }
      setItem(data);
    }).catch(() => navigate('/dashboard'));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Report updated');
      navigate(`/items/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return (
    <div className="page-container max-w-xl">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => <div key={i} className="h-9 bg-gray-100 rounded-lg" />)}
      </div>
    </div>
  );

  return (
    <div className="page-container max-w-xl">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-5">
        <FiArrowLeft className="text-sm" /> Back
      </button>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">Edit report</h1>
        <p className="text-sm text-gray-400">Update the details of your report</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <ItemForm initial={item} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
