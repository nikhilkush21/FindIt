import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import { CardSkeleton } from '../components/Skeleton';
import { ArrowRight, Search, FileText, CheckCircle, Edit3, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/items?limit=8&sort=newest'),
      api.get('/items?status=resolved&limit=1'),
    ])
      .then(([a, b]) => {
        setRecent(a.data.items);
        setStats({ total: a.data.total, resolved: b.data.total });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              AI-Powered Matching · Free to use
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              The smartest way to report<br className="hidden md:block" /> lost & found items.
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              FindIt uses AI to match lost items with found ones — helping students, employees, and communities recover belongings faster.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/report" className="btn-primary px-5 py-2.5 text-sm">
                Report an item <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/browse" className="btn-secondary px-5 py-2.5 text-sm">
                <Search className="w-4 h-4" /> Browse reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap gap-6 md:gap-12">
          {[
            { value: stats.total, label: 'Items reported' },
            { value: stats.resolved, label: 'Items recovered' },
            { value: 'AI', label: 'Powered matching' },
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
              { num: '1', icon: <Edit3 className="text-gray-700 w-4 h-4" />, title: 'Submit a report', desc: 'Describe the item with photos and location. Our AI extracts features to power matching.' },
              { num: '2', icon: <Zap className="text-amber-600 w-4 h-4" />, title: 'AI finds matches', desc: 'Our AI compares descriptions, images, and location to show you the most similar items from the other side.' },
              { num: '3', icon: <CheckCircle className="text-emerald-600 w-4 h-4" />, title: 'Claim & recover', desc: 'Submit a private ownership claim. Answer verification questions. The finder reviews and contacts you.' },
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
          <div className="mt-8">
            <Link to="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 w-fit">
              Learn more about FindIt <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI trust note */}
      <section className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-3">
          <ShieldCheck className="text-amber-600 w-5 h-5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>AI Note:</strong> Similarity scores are a ranking tool to help you discover potential matches faster. They do not prove ownership and are not used as automatic verification.
          </p>
        </div>
      </section>

      {/* Recent reports */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent reports</h2>
            <p className="text-sm text-gray-400 mt-0.5">Latest lost & found submissions</p>
          </div>
          <Link to="/browse" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileText className="text-gray-300 w-8 h-8 mx-auto mb-3" strokeWidth={1} />
            <p className="font-medium text-gray-600">No reports yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Be the first to submit a report</p>
            <Link to="/report" className="btn-primary text-sm">Report an item</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recent.map((item) => <ItemCard key={item._id} item={item} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-gray-900 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Lost something?</h2>
            <p className="text-gray-400 text-sm">Submit a report in under 2 minutes. AI matching starts immediately.</p>
          </div>
          <Link to="/register" className="flex-shrink-0 btn-primary bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
