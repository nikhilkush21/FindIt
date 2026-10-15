import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        <Search className="text-gray-400 w-8 h-8" strokeWidth={1.5} />
      </div>
      <h1 className="text-6xl font-bold text-gray-900 mb-3">404</h1>
      <p className="text-xl font-semibold text-gray-700 mb-2">Page not found</p>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" /> Go home
        </Link>
        <Link to="/browse" className="btn-secondary">Browse items</Link>
      </div>
    </div>
  );
}
