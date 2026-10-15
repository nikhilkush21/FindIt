import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, LogOut, User, LayoutDashboard,
  Menu, X, ChevronDown, Bell, Shield
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navCls = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
      isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
            <Search className="text-white w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">FindIt</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          <NavLink to="/browse" className={navCls}>Browse</NavLink>
          <NavLink to="/how-it-works" className={navCls}>How it works</NavLink>
          {user && (
            <>
              <NavLink to="/report" className={navCls}>Report</NavLink>
              <NavLink to="/dashboard" className={navCls}>Dashboard</NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navCls + ' text-purple-700'}>Admin</NavLink>
          )}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              {/* Notifications */}
              <Link to="/notifications" className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/report" className="btn-primary py-1.5 px-3 text-xs">
                <Plus className="w-3 h-3" strokeWidth={2.5} /> New Report
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={dropOpen}
                >
                  <div className="w-7 h-7 rounded-md bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`text-gray-400 w-3 h-3 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 overflow-hidden z-50">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="text-gray-400 w-4 h-4" /> Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard className="text-gray-400 w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/notifications" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Bell className="text-gray-400 w-4 h-4" />
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors">
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary py-1.5 px-3 text-xs">Sign in</Link>
              <Link to="/register" className="btn-primary py-1.5 px-3 text-xs">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-0.5">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <Link to="/notifications" onClick={() => setMenuOpen(false)} className="ml-auto relative">
                <Bell className="w-5 h-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          )}
          {[
            { to: '/browse', label: 'Browse Items' },
            { to: '/how-it-works', label: 'How it works' },
            ...(user
              ? [
                  { to: '/report', label: 'Report Item' },
                  { to: '/dashboard', label: 'Dashboard' },
                  { to: '/profile', label: 'Profile' },
                  ...(user.role === 'admin' ? [{ to: '/admin', label: '⚙ Admin Panel' }] : []),
                ]
              : [{ to: '/login', label: 'Sign in' }, { to: '/register', label: 'Get started' }]
            ),
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <button onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1">
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
