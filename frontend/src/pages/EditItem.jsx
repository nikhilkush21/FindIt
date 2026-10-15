import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ItemForm from '../components/ItemForm';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { FormSkeleton } from '../components/Skeleton';

export default function EditItem() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(({ data }) => {
        if (data.reportedBy._id !== user._id) {
          toast.error('Not authorized');
          navigate('/dashboard');
          return;
        }
        setItem(data);
      })
      .catch(() => navigate('/dashboard'));
  }, [id, user, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await api.put(`/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Report updated');
      navigate(`/items/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-sm">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-5">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">Edit report</h1>
        <p className="text-sm text-gray-400">Update the details of your report</p>
      </div>
      <div className="card">
        {item ? (
          <ItemForm initial={item} onSubmit={handleSubmit} loading={loading} isEdit />
        ) : (
          <FormSkeleton />
        )}
      </div>
    </div>
  );
}
