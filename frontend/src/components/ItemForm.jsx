import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Search, CheckCircle, Zap } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 'Wallet/Purse', 'ID/Cards', 'Keys',
  'Bag', 'Clothing', 'Jewelry', 'Books/Documents',
  'Accessories', 'Other',
];

const CATEGORY_KEYWORDS = {
  Electronics: ['phone', 'mobile', 'iphone', 'samsung', 'laptop', 'charger', 'earphone', 'headphone', 'tablet', 'ipad', 'watch', 'camera', 'airpod'],
  'Wallet/Purse': ['wallet', 'purse', 'money', 'cash', 'billfold'],
  'ID/Cards': ['id', 'card', 'aadhar', 'pan', 'passport', 'license', 'student id', 'identity'],
  Keys: ['key', 'keys', 'keychain', 'locker'],
  Bag: ['bag', 'backpack', 'handbag', 'suitcase', 'luggage', 'pouch'],
  Clothing: ['shirt', 'jacket', 'coat', 'sweater', 'hoodie', 'scarf', 'cap', 'hat', 'shoes', 'glasses', 'umbrella'],
  Jewelry: ['ring', 'necklace', 'bracelet', 'earring', 'chain', 'bangle', 'pendant'],
  'Books/Documents': ['book', 'notebook', 'document', 'notes', 'folder', 'file'],
};

function detectCategory(title) {
  const lower = title.toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some((kw) => lower.includes(kw))) return cat;
  }
  return null;
}

const schema = z.object({
  type: z.enum(['lost', 'found']),
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.enum(CATEGORIES),
  location: z.string().min(2, 'Location is required').max(200),
  date: z.string().min(1, 'Date is required'),
  identifyingFeatures: z.string().max(500).optional(),
  status: z.enum(['open', 'claimed', 'resolved', 'expired']).optional(),
});

export default function ItemForm({ initial = {}, onSubmit, loading, isEdit = false }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initial.type || 'lost',
      title: initial.title || '',
      description: initial.description || '',
      category: initial.category || 'Other',
      location: initial.location || '',
      date: initial.date ? initial.date.slice(0, 10) : '',
      identifyingFeatures: initial.identifyingFeatures || '',
      status: initial.status || 'open',
    },
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(
    Array.isArray(initial.images) ? initial.images : initial.image ? [initial.image] : []
  );
  const [autoCategory, setAutoCategory] = useState(false);

  const titleValue = watch('title');

  useEffect(() => {
    if (!titleValue) return;
    const detected = detectCategory(titleValue);
    if (detected) {
      setValue('category', detected);
      setAutoCategory(true);
    } else {
      setAutoCategory(false);
    }
  }, [titleValue, setValue]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImages((prev) => [...prev, ...files].slice(0, 4));
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls].slice(0, 4));
  };

  const removePreview = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onFormSubmit = (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
    images.forEach((img) => fd.append('images', img));
    onSubmit(fd);
  };

  const typeValue = watch('type');

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      {/* Type toggle */}
      {!isEdit && (
        <div className="flex gap-3">
          {[
            { val: 'lost', label: 'Lost Item', icon: <Search className="w-4 h-4" /> },
            { val: 'found', label: 'Found Item', icon: <CheckCircle className="w-4 h-4" /> },
          ].map(({ val, label, icon }) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue('type', val)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold border-2 transition-all text-sm ${
                typeValue === val
                  ? val === 'lost'
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="label" htmlFor="title">Item Title *</label>
        <input id="title" {...register('title')} className={`input ${errors.title ? 'input-error' : ''}`}
          placeholder="e.g. Black iPhone 14" />
        {errors.title && <p className="error-msg">{errors.title.message}</p>}
      </div>

      {/* Category + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="category">
            Category *
            {autoCategory && (
              <span className="inline-flex items-center gap-1 ml-2 text-xs text-blue-500 font-medium">
                <Zap className="w-3 h-3" /> auto-detected
              </span>
            )}
          </label>
          <select id="category" {...register('category')}
            onChange={(e) => { setValue('category', e.target.value); setAutoCategory(false); }}
            className="input">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">Date *</label>
          <input id="date" type="date" {...register('date')}
            max={new Date().toISOString().slice(0, 10)}
            className={`input ${errors.date ? 'input-error' : ''}`} />
          {errors.date && <p className="error-msg">{errors.date.message}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="label" htmlFor="location">Location *</label>
        <input id="location" {...register('location')} className={`input ${errors.location ? 'input-error' : ''}`}
          placeholder="e.g. Library Block A, Gate 2" />
        {errors.location && <p className="error-msg">{errors.location.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="label" htmlFor="description">Description *</label>
        <textarea id="description" {...register('description')} rows={3}
          className={`input resize-none ${errors.description ? 'input-error' : ''}`}
          placeholder="Describe the item — color, brand, distinguishing features..." />
        {errors.description && <p className="error-msg">{errors.description.message}</p>}
      </div>

      {/* Identifying features */}
      <div>
        <label className="label" htmlFor="identifyingFeatures">
          Identifying Features
          <span className="font-normal text-gray-400 ml-1">(helps AI matching)</span>
        </label>
        <input id="identifyingFeatures" {...register('identifyingFeatures')} className="input"
          placeholder="e.g. scratched back, blue case, initials 'JK'" />
      </div>

      {/* Status (edit only) */}
      {isEdit && (
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" {...register('status')} className="input">
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      )}

      {/* Images */}
      <div>
        <label className="label">
          Photos
          <span className="font-normal text-gray-400 ml-1">(up to 4, helps AI matching)</span>
        </label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {previews.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removePreview(idx)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-md p-0.5 hover:bg-black/70">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {previews.length < 4 && (
            <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              <div className="text-center">
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-400">Add photo</span>
              </div>
              <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB each</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Saving...
          </span>
        ) : isEdit ? 'Update Report' : 'Submit Report'}
      </button>
    </form>
  );
}
