import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Plus, LogOut, User as UserIcon, UserPlus, LogIn, Bell, Check, Heart, LayoutList, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { notificationsAPI } from '../api';
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/animate-ui/components/radix/sheet';

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = ({ isTransparent }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch {
      // silently ignore — notification bell is non-critical
    } finally {
      setIsLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleOpenChange = (open) => { if (open) fetchNotifications(); };

  const handleNotificationClick = async (n) => {
    if (!n.read) {
      try {
        await notificationsAPI.markRead(n._id);
        setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch { /* ignore */ }
    }
    if (n.listing?._id) navigate(`/listings/${n.listing._id}`);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className={`relative flex items-center justify-center size-9 rounded-full transition-colors ${
          isTransparent ? 'text-white hover:bg-white/20' : 'text-on-surface-variant hover:bg-surface-container-low'
        }`}>
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/40">
          <span className="text-sm font-semibold text-on-surface">Notifications</span>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
              <Check className="size-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading && !loaded ? (
            <p className="text-sm text-on-surface-variant text-center py-6">Loading…</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-6">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`flex flex-col items-start gap-0.5 w-full text-left px-4 py-3 border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
              >
                <span className="text-sm text-on-surface leading-snug">{n.message}</span>
                <span className="text-xs text-on-surface-variant">{timeAgo(n.createdAt)}</span>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const WishlistButton = ({ isTransparent }) => {
  const navigate = useNavigate();
  const { favoriteIds } = useFavorites();
  const count = favoriteIds.size;

  return (
    <button
      onClick={() => navigate('/wishlist')}
      aria-label="Wishlist"
      className={`relative flex items-center justify-center size-9 rounded-full transition-colors ${
        isTransparent ? 'text-white hover:bg-white/20' : 'text-on-surface-variant hover:bg-surface-container-low'
      }`}
    >
      <Heart className="size-4.5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const isExplore = location.pathname === '/listing' || (location.pathname.startsWith('/listings') && location.pathname !== '/listing/new');
  const isBecomeHost = location.pathname === '/listing/new';

  const isTransparent = isHome && !scrolled;

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    const success = await logout();
    if (success) navigate('/user/login');
  };

  const go = (path) => { setMenuOpen(false); navigate(path); };

  return (
    <nav className={`z-50 transition-all duration-300 ${
      isHome ? 'fixed top-0 inset-x-0' : 'sticky top-0'
    } ${
      isTransparent
        ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent border-transparent shadow-none'
        : 'glass-effect border-b border-outline-variant/40 shadow-sm'
    }`}>
      <div className="relative max-w-7xl mx-auto px-margin-mobile md:px-lg h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center no-underline shrink-0">
          <span className={`font-heading font-bold text-headline-md tracking-tight transition-colors duration-300 ${
            isTransparent ? 'text-white drop-shadow-md' : 'text-primary'
          }`}>
            Horizn
          </span>
        </Link>

        {/* Centered nav links — desktop only */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            to="/"
            className={`relative py-1 text-sm no-underline transition-colors duration-200 ${
              isHome
                ? (isTransparent ? 'text-white font-bold' : 'text-primary font-bold')
                : (isTransparent ? 'text-white/80 font-medium hover:text-white' : 'text-on-surface-variant font-medium hover:text-primary')
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-primary after:rounded-full after:transition-transform after:duration-200 after:ease-out ${
              isHome ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Discover
          </Link>
          <Link
            to="/listing"
            className={`relative py-1 text-sm no-underline transition-colors duration-200 ${
              isExplore
                ? (isTransparent ? 'text-white font-bold' : 'text-primary font-bold')
                : (isTransparent ? 'text-white/80 font-medium hover:text-white' : 'text-on-surface-variant font-medium hover:text-primary')
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-primary after:rounded-full after:transition-transform after:duration-200 after:ease-out ${
              isExplore ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Explore stays
          </Link>
          <Link
            to="/listing/new"
            className={`relative py-1 text-sm no-underline transition-colors duration-200 ${
              isBecomeHost
                ? (isTransparent ? 'text-white font-bold' : 'text-primary font-bold')
                : (isTransparent ? 'text-white/80 font-medium hover:text-white' : 'text-on-surface-variant font-medium hover:text-primary')
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-primary after:rounded-full after:transition-transform after:duration-200 after:ease-out ${
              isBecomeHost ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Become a host
          </Link>
        </div>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user && <WishlistButton isTransparent={isTransparent} />}
          {user && <NotificationBell isTransparent={isTransparent} />}
          <ThemeTogglerButton
            variant="ghost"
            size="icon"
            className={`rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/20' : ''}`}
            modes={['light', 'dark']}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-2 pl-3 pr-1 py-1 border rounded-full transition-all hover:shadow-md ${
                isTransparent
                  ? 'border-white/30 bg-black/20 backdrop-blur-md text-white hover:bg-black/40'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface'
              }`}>
                <Menu className={`size-4 ${isTransparent ? 'text-white' : 'text-on-surface-variant'}`} />
                {user ? (
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
                      {user.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isTransparent ? 'bg-white/20' : 'bg-surface-container-high'
                  }`}>
                    <UserIcon className={`size-4 ${isTransparent ? 'text-white' : 'text-on-surface-variant'}`} />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {!user ? (
                <>
                  <DropdownMenuItem onSelect={() => navigate('/user/signup')} className="cursor-pointer font-semibold">
                    <UserPlus /> Sign up
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/user/login')} className="cursor-pointer">
                    <LogIn /> Log in
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/listing/new')} className="cursor-pointer">
                    <Plus /> Become a host
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onSelect={() => navigate('/user/profile')} className="cursor-pointer">
                    <UserIcon /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/listing/mine')} className="cursor-pointer">
                    <LayoutList /> Your listings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/listing/new')} className="cursor-pointer">
                    <Plus /> Add a listing
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onSelect={() => navigate('/admin/reports')} className="cursor-pointer">
                      <ShieldAlert /> Reports
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer">
                    <LogOut /> Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side — mobile */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          {user && <WishlistButton isTransparent={isTransparent} />}
          {user && <NotificationBell isTransparent={isTransparent} />}
          <ThemeTogglerButton
            variant="ghost"
            size="icon"
            className={`rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/20' : ''}`}
            modes={['light', 'dark']}
          />

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <button
              onClick={() => setMenuOpen(true)}
              className={`flex items-center gap-2 pl-3 pr-1 py-1 border rounded-full transition-all hover:shadow-md ${
                isTransparent
                  ? 'border-white/30 bg-black/20 backdrop-blur-md text-white hover:bg-black/40'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface'
              }`}
            >
              <Menu className={`size-4 ${isTransparent ? 'text-white' : 'text-on-surface-variant'}`} />
              {user ? (
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isTransparent ? 'bg-white/20' : 'bg-surface-container-high'
                }`}>
                  <UserIcon className={`size-4 ${isTransparent ? 'text-white' : 'text-on-surface-variant'}`} />
                </div>
              )}
            </button>
            <SheetContent side="right" className="p-0">
              <SheetHeader className="border-b border-outline-variant/40">
                <SheetTitle className="font-heading font-bold text-primary">
                  Horizn
                </SheetTitle>
              </SheetHeader>

              <div className="px-4 py-4 flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm no-underline rounded-xl transition-all ${
                    isHome
                      ? 'text-primary font-bold bg-primary/5'
                      : 'text-on-surface/80 font-medium hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  Discover
                </Link>
                <Link
                  to="/listing"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm no-underline rounded-xl transition-all ${
                    isExplore
                      ? 'text-primary font-bold bg-primary/5'
                      : 'text-on-surface/80 font-medium hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  Explore stays
                </Link>
                <Link
                  to="/listing/new"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm no-underline rounded-xl transition-all ${
                    isBecomeHost
                      ? 'text-primary font-bold bg-primary/5'
                      : 'text-on-surface/80 font-medium hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  Become a host
                </Link>

                <DropdownMenuSeparator className="my-2" />

                {!user ? (
                  <>
                    <Link to="/user/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-on-surface/80 text-sm font-medium no-underline rounded-xl hover:bg-surface-container-low transition-all">
                      <LogIn className="text-primary size-4" />
                      Log in
                    </Link>
                    <button onClick={() => go('/user/signup')} className="mt-2 flex items-center justify-center gap-2 py-3 bg-primary text-on-primary text-sm font-bold rounded-full border-0 cursor-pointer">
                      <UserPlus className="size-4" /> Sign up
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/user/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-on-surface/80 text-sm font-medium no-underline rounded-xl hover:bg-surface-container-low transition-all">
                      <UserIcon className="text-primary size-4" />
                      {user.username}
                    </Link>
                    <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-on-surface/80 text-sm font-medium no-underline rounded-xl hover:bg-surface-container-low transition-all">
                      <Heart className="text-primary size-4" />
                      Wishlist
                    </Link>
                    <Link to="/listing/mine" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-on-surface/80 text-sm font-medium no-underline rounded-xl hover:bg-surface-container-low transition-all">
                      <LayoutList className="text-primary size-4" />
                      Your listings
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin/reports" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-on-surface/80 text-sm font-medium no-underline rounded-xl hover:bg-surface-container-low transition-all">
                        <ShieldAlert className="text-primary size-4" />
                        Reports
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-destructive text-sm font-medium border-0 bg-transparent cursor-pointer rounded-xl hover:bg-destructive/10 transition-all w-full text-left">
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
