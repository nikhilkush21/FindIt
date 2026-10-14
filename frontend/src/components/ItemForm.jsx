import { useState } from 'react';
import { FiUpload, FiX, FiSearch, FiCheckCircle, FiZap } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Wallet/Purse', 'ID/Cards', 'Bag', 'Keys', 'Clothing', 'Jewelry', 'Other'];

const CATEGORY_KEYWORDS = {
  Electronics: ['phone', 'mobile', 'iphone', 'samsung', 'laptop', 'charger', 'earphone', 'headphone', 'tablet', 'ipad', 'watch', 'camera', 'cable', 'powerbank', 'airpod', 'earbud'],
  'Wallet/Purse': ['wallet', 'purse', 'money', 'cash', 'card holder', 'billfold'],
  'ID/Cards': ['id', 'card', 'aadhar', 'pan', 'passport', 'license', 'student id', 'identity', 'driving'],
  Bag: ['bag', 'backpack', 'handbag', 'suitcase', 'luggage', 'pouch', 'satchel', 'tote'],
  Keys: ['key', 'keys', 'keychain', 'locker', 'bike key', 'car key'],
  Clothing: ['shirt', 'jacket', 'coat', 'sweater', 'hoodie', 'scarf', 'cap', 'hat', 'shoes', 'sandal', 'glasses', 'spectacles', 'umbrella', 'gloves'],
  Jewelry: ['ring', 'necklace', 'bracelet', 'earring', 'chain', 'bangle', 'pendant', 'locket'],
};

function detectCategory(title) {
  const lower = title.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return null;
}

const EMPTY_FORM = (type) => ({
  type,
  title: '',
  description: '',
  category: 'Other',
  location: '',
  date: '',
  status: 'open',
});

export default function ItemForm({ initial = {}, onSubmit, loading }) {
  const isEdit = !!initial._id;

  const [form, setForm] = useState(
    isEdit
      ? {
          type: initial.type || 'lost',
          title: initial.title || '',
          description: initial.description || '',
          category: initial.category || 'Other',
          location: initial.location || '',
          date: initial.date ? initial.date.slice(0, 10) : '',
          status: initial.status || 'open',
        }
      : EMPTY_FORM(initial.type || 'lost')
  );

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initial.image || '');
  const [errors, setErrors] = useState({});
  const [autoCategory, setAutoCategory] = useState(false);

  const handleTypeChange = (t) => {
    if (!isEdit) {
      setForm(EMPTY_FORM(t));
      setImage(null);
      setPreview('');
      setErrors({});
      setAutoCategory(false);
    } else {
      setForm((f) => ({ ...f, type: t }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'title') {
      const detected = detectCategory(value);
      if (detected) {
        setForm((f) => ({ ...f, title: value, category: detected }));
        setAutoCategory(true);
      } else {
        setAutoCategory(false);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const required = ['title', 'description', 'location', 'date'];
    if (required.includes(name) && (!value || !value.trim())) {
      setErrors((prev) => ({ ...prev, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required` }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => { setImage(null); setPreview(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Type Toggle */}
      <div className="flex gap-3">
        {[
          { val: 'lost', label: 'Lost Item', icon: <FiSearch /> },
          { val: 'found', label: 'Found Item', icon: <FiCheckCircle /> },
        ].map(({ val, label, icon }) => (
          <button
            key={val}
            type="button"
            onClick={() => handleTypeChange(val)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold border-2 transition-all text-sm ${
              form.type === val
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

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input ${errors.title ? 'input-error' : ''}`}
          placeholder="e.g. Black iPhone 14"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Category + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            Category *
            {autoCategory && (
              <span className="flex items-center gap-1 text-xs text-blue-500 font-medium">
                <FiZap className="text-xs" /> auto-detected
              </span>
            )}
          </label>
          <select
            name="category"
            value={form.category}
            onChange={(e) => { handleChange(e); setAutoCategory(false); }}
            className="input"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            onBlur={handleBlur}
            max={new Date().toISOString().slice(0, 10)}
            className={`input ${errors.date ? 'input-error' : ''}`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location *</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input ${errors.location ? 'input-error' : ''}`}
          placeholder="e.g. Library, Block A"
        />
        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
          className={`input resize-none ${errors.description ? 'input-error' : ''}`}
          placeholder="Describe the item — color, brand, distinguishing features..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Status (edit only) */}
      {isEdit && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input">
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      )}

      {/* Photo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photo</label>
        {!preview ? (
          <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiUpload className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        ) : (
          <div className="relative">
            <img src={preview} alt="preview" className="h-40 w-full object-cover rounded-xl" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white rounded-lg p-1.5 shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Submitting...
          </span>
        ) : isEdit ? 'Update Report' : 'Submit Report'}
      </button>
    </form>
  );
}
