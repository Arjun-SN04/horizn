import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setSearchQuery(searchParams.get('search') || ''); }, [searchParams]);

  const handleLogout = async () => {
    const success = await logout();
    if (success) navigate('/user/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/listing?search=${encodeURIComponent(searchQuery.trim())}` : '/listing');
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname.startsWith('/listing')) {
      navigate(val.trim() ? `/listing?search=${encodeURIComponent(val.trim())}` : '/listing', { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <i className="fa-solid fa-compass text-white text-sm"></i>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">WanderLust</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="search"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search destinations, cities..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 outline-none transition-all focus:border-red-500 focus:bg-white pl-10"
            />
          </div>
        </form>

        {/* Nav */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <Link to="/listing" className="px-3.5 py-2 text-gray-500 text-sm font-medium no-underline rounded-lg transition-all hover:text-gray-900 hover:bg-gray-50">
            Explore
          </Link>

          {!user ? (
            <>
              <Link to="/user/login" className="px-3.5 py-2 text-gray-500 text-sm font-medium no-underline rounded-lg transition-all hover:text-gray-900 hover:bg-gray-50">
                Login
              </Link>
              <Link to="/user/signup" className="px-4.5 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold no-underline rounded-lg shadow-md hover:shadow-lg transition-all">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/listing/new" className="px-3.5 py-2 text-gray-500 text-xs font-semibold no-underline rounded-lg border border-gray-200 transition-all hover:border-red-500 hover:text-red-500 flex items-center gap-1.5">
                <i className="fa-solid fa-plus text-xs"></i> Add
              </Link>
              <Link to="/user/profile" className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 no-underline transition-all hover:border-red-500 hover:bg-red-50 cursor-pointer">
                <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 font-semibold max-w-20 overflow-hidden text-ellipsis whitespace-nowrap">{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="px-3.5 py-2 text-gray-400 text-xs font-medium border-0 bg-transparent cursor-pointer rounded-lg transition-all hover:text-red-500 hover:bg-red-50">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};