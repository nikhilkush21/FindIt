import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import { CardSkeleton } from '../components/Skeleton';
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 'Wallet/Purse', 'ID/Cards', 'Keys',
  'Bag', 'Clothing', 'Jewelry', 'Books/Documents',
  'Accessories', 'Other',
];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'open';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (type) p.set('type', type);
    if (category) p.set('category', category);
    if (search) p.set('search', search);
    if (status) p.set('status', status);
    p.set('sort', sort);
    p.set('page', page);
    p.set('limit', 12);

    api.get(`/items?${p}`)
      .then(({ data }) => {
        setItems(data.items);
        setTotal(data.total);
        setPages(data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type, category, search, status, sort, page]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearAll = () => { setSearchInput(''); setSearchParams({}); };
  const hasFilters = type || category || search || (status && status !== 'open');

  const goPage = (p) => {
    const np = new URLSearchParams(searchParams);
    np.set('page', p);
    setSearchParams(np);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-container">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">Browse items</h1>
        <p className="text-sm text-gray-400">Search all lost and found reports</p>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); setParam('search', searchInput.trim()); }}
        className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input className="input pl-9 pr-8" placeholder="Search by name, description, or location..."
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); setParam('search', ''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button type="submit" className="btn-primary px-4">Search</button>
      </form>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Filters</span>
          {hasFilters && (
            <button onClick={clearAll} className="ml-auto text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Type */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            {[['', 'All Types'], ['lost', 'Lost'], ['found', 'Found']].map(([val, label]) => (
              <button key={val} onClick={() => setParam('type', val)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-gray-200 last:border-0 ${type === val ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            {[['open', 'Open'], ['resolved', 'Resolved'], ['', 'All Status']].map(([val, label]) => (
              <button key={val} onClick={() => setParam('status', val)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-gray-200 last:border-0 ${status === val ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={(e) => setParam('sort', e.target.value)}
            className="input !w-auto text-xs py-1.5 border-gray-200 bg-gray-50">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="date_desc">Date (latest)</option>
            <option value="date_asc">Date (earliest)</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setParam('category', category === c ? '' : c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${category === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-4">
        {loading ? 'Loading...' : (
          <><span className="font-semibold text-gray-700">{total}</span> result{total !== 1 ? 's' : ''}</>
        )}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Search className="text-gray-300 w-8 h-8 mx-auto mb-3" />
          <p className="font-medium text-gray-700">No results found</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Try different keywords or remove some filters</p>
          {hasFilters && <button onClick={clearAll} className="btn-secondary text-xs">Clear filters</button>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button onClick={() => goPage(page - 1)} disabled={page === 1} className="btn-secondary px-2.5 py-2 disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
            const p = pages <= 7 ? i + 1 : i + Math.max(1, page - 3);
            if (p > pages) return null;
            return (
              <button key={p} onClick={() => goPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {p}
              </button>
            );
          })}
          <button onClick={() => goPage(page + 1)} disabled={page === pages} className="btn-secondary px-2.5 py-2 disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
