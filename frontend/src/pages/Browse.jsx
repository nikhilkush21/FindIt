import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import { CardSkeleton } from '../components/Skeleton';
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Wallet/Purse', 'ID/Cards', 'Bag', 'Keys', 'Clothing', 'Jewelry', 'Other'];

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
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (type) p.set('type', type);
    if (category) p.set('category', category);
    if (search) p.set('search', search);
    p.set('page', page); p.set('limit', 9);
    api.get(`/items?${p}`)
      .then(({ data }) => { setItems(data.items); setTotal(data.total); setPages(data.pages); })
      .finally(() => setLoading(false));
  }, [type, category, search, page]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearAll = () => { setSearchInput(''); setSearchParams({}); };
  const hasFilters = type || category || search;

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
        <p className="text-sm text-gray-400">Search through all lost and found reports</p>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); setParam('search', searchInput.trim()); }}
        className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input className="input pl-9 pr-8" placeholder="Search by name, description, or location..."
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); setParam('search', ''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX className="text-sm" />
            </button>
          )}
        </div>
        <button type="submit" className="btn-primary px-4">Search</button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {/* Type */}
        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
          {[['', 'All'], ['lost', 'Lost'], ['found', 'Found']].map(([val, label]) => (
            <button key={val} onClick={() => setParam('type', val)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-gray-200 last:border-0 ${type === val ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Categories */}
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setParam('category', category === c ? '' : c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${category === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
            {c}
          </button>
        ))}

        {hasFilters && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 ml-1">
            <FiX className="text-xs" /> Clear
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-4">
        {loading ? 'Loading...' : <><span className="font-semibold text-gray-700">{total}</span> result{total !== 1 ? 's' : ''}</>}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <FiSearch className="text-gray-300 text-3xl mx-auto mb-3" />
          <p className="font-medium text-gray-700">No results found</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Try different keywords or remove filters</p>
          {hasFilters && <button onClick={clearAll} className="btn-secondary text-xs">Clear filters</button>}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button onClick={() => goPage(page - 1)} disabled={page === 1} className="btn-secondary px-2.5 py-2 disabled:opacity-40">
            <FiChevronLeft className="text-sm" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => goPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => goPage(page + 1)} disabled={page === pages} className="btn-secondary px-2.5 py-2 disabled:opacity-40">
            <FiChevronRight className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
