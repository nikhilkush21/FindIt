import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ItemForm from '../components/ItemForm';
import toast from 'react-hot-toast';

export default function ReportItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Report submitted successfully');
      navigate(`/items/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-sm">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">Report an item</h1>
        <p className="text-sm text-gray-400">Fill in the details to submit your report. More detail = better AI matches.</p>
      </div>
      <div className="card">
        <ItemForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
