import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiPlus, FiLogOut, FiUser, FiMenu, FiX, FiLayout, FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); setDropOpen(false); setMenuOpen(false); navigate('/'); };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const navLink = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
            <FiSearch className="text-white text-xs" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">FindIt</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          <NavLink to="/browse" className={navLink}>Browse</NavLink>
          {user && (
            <>
              <NavLink to="/report" className={navLink}>Report Item</NavLink>
              <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>
            </>
          )}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <Link to="/report" className="btn-primary py-1.5 px-3 text-xs">
                <FiPlus strokeWidth={2.5} /> New Report
              </Link>
              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-7 h-7 rounded-md bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <FiChevronDown className={`text-gray-400 text-xs transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 overflow-hidden">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiUser className="text-gray-400 text-sm" /> Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiLayout className="text-gray-400 text-sm" /> Dashboard
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                        <FiLogOut className="text-sm" /> Sign out
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
        <button className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-0.5">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{initials}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          {[
            { to: '/browse', label: 'Browse Items' },
            ...(user
              ? [{ to: '/report', label: 'Report Item' }, { to: '/dashboard', label: 'Dashboard' }, { to: '/profile', label: 'Profile' }]
              : [{ to: '/login', label: 'Sign in' }, { to: '/register', label: 'Get started' }]
            ),
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }>
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
