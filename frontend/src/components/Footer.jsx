import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
            <FiSearch className="text-white text-[10px]" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900 text-sm">FindIt</span>
        </Link>
        <div className="flex items-center gap-5">
          {[['/', 'Home'], ['/browse', 'Browse'], ['/report', 'Report'], ['/login', 'Sign in']].map(([to, label]) => (
            <Link key={to} to={to} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{label}</Link>
          ))}
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} FindIt</p>
      </div>
    </footer>
  );
}
