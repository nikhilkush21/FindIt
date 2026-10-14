import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import { CardSkeleton } from '../components/Skeleton';
import { FiArrowRight, FiSearch, FiFileText, FiCheckCircle, FiEdit3 } from 'react-icons/fi';

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/items?limit=6'),
      api.get('/items?status=resolved&limit=1'),
    ]).then(([a, b]) => {
      setRecent(a.data.items);
      setStats({ total: a.data.total, resolved: b.data.total });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Free to use · No account needed to browse
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              The simplest way to report<br className="hidden md:block" /> lost & found items.
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              FindIt helps students, employees, and communities report and recover lost items — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/report" className="btn-primary px-5 py-2.5 text-sm">
                Report an item <FiArrowRight />
              </Link>
              <Link to="/browse" className="btn-secondary px-5 py-2.5 text-sm">
                <FiSearch /> Browse reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap gap-6 md:gap-10">
          {[
            { value: stats.total, label: 'Items reported' },
            { value: stats.resolved, label: 'Items recovered' },
            { value: 'Free', label: 'Always' },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className="text-sm text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">How it works</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Three steps to recover your item</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', icon: <FiEdit3 className="text-gray-700" />, title: 'Submit a report', desc: 'Describe the item, add a photo, and mention where and when it was lost or found.' },
              { num: '2', icon: <FiSearch className="text-gray-700" />, title: 'Browse & search', desc: 'Search by keyword, category, or location. The system shows you possible matches.' },
              { num: '3', icon: <FiCheckCircle className="text-gray-700" />, title: 'Contact & recover', desc: 'Reach out to the reporter directly via email or phone to get your item back.' },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-1">Step {num}</p>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent reports</h2>
            <p className="text-sm text-gray-400 mt-0.5">Latest lost & found submissions</p>
          </div>
          <Link to="/browse" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
            View all <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FiFileText className="text-gray-300 text-3xl mx-auto mb-3" />
            <p className="font-medium text-gray-600">No reports yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Be the first to submit a report</p>
            <Link to="/report" className="btn-primary text-sm">Report an item</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {recent.map((item) => <ItemCard key={item._id} item={item} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-gray-900 rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Lost something?</h2>
            <p className="text-gray-400 text-sm">Submit a report in under 2 minutes. It's completely free.</p>
          </div>
          <Link to="/register" className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            Get started <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
