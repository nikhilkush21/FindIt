import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
                <Search className="text-white w-3 h-3" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-gray-900 text-sm">FindIt</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Helping people report and recover lost items through community and AI-powered matching.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest mb-3">Platform</p>
            <div className="space-y-2">
              {[['/', 'Home'], ['/browse', 'Browse Items'], ['/report', 'Report Item'], ['/how-it-works', 'How it works']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-xs text-gray-400 hover:text-gray-700 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest mb-3">Legal</p>
            <div className="space-y-2">
              {[['/privacy', 'Privacy Policy']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-xs text-gray-400 hover:text-gray-700 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} FindIt. All rights reserved.</p>
          <p className="text-xs text-gray-400">AI similarity scores are for guidance only and do not prove ownership.</p>
        </div>
      </div>
    </footer>
  );
}
