import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Plus, LogOut, User as UserIcon, UserPlus, LogIn, Bell, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

const NotificationBell = () => {
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
        <button className="relative flex items-center justify-center size-9 rounded-full hover:bg-surface-container-low transition-colors">
          <Bell className="size-4.5 text-on-surface-variant" />
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

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    setMenuOpen(false);
    const success = await logout();
    if (success) navigate('/user/login');
  };

  const go = (path) => { setMenuOpen(false); navigate(path); };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-outline-variant/40 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-margin-mobile md:px-lg h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center no-underline shrink-0">
          <span className="font-heading font-bold text-primary text-headline-md tracking-tight">Horizn</span>
        </Link>

        {/* Centered nav links — desktop only, contextual per page */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {isHome && (
            <Link to="/" className="text-primary text-sm font-bold no-underline border-b-2 border-primary pb-1.5 -mb-1.5">
              Discover
            </Link>
          )}
          <Link to="/listing" className="text-on-surface-variant text-sm font-medium no-underline hover:text-on-surface transition-colors">
            Explore stays
          </Link>
          <Link to="/listing/new" className="text-on-surface-variant text-sm font-medium no-underline hover:text-on-surface transition-colors">
            Become a host
          </Link>
        </div>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user && <NotificationBell />}
          <ThemeTogglerButton variant="ghost" size="icon" className="rounded-full" modes={['light', 'dark']} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-3 pr-1 py-1 border border-outline-variant rounded-full transition-all hover:shadow-md bg-surface-container-lowest">
                <Menu className="size-4 text-on-surface-variant" />
                {user ? (
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
                      {user.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center">
                    <UserIcon className="size-4 text-on-surface-variant" />
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
                  <DropdownMenuItem onSelect={() => navigate('/listing/new')} className="cursor-pointer">
                    <Plus /> Add a listing
                  </DropdownMenuItem>
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
          {user && <NotificationBell />}
          <ThemeTogglerButton variant="ghost" size="icon" className="rounded-full" modes={['light', 'dark']} />

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 pl-3 pr-1 py-1 border border-outline-variant rounded-full transition-all hover:shadow-md bg-surface-container-lowest"
            >
              <Menu className="size-4 text-on-surface-variant" />
              {user ? (
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center">
                  <UserIcon className="size-4 text-on-surface-variant" />
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
                {isHome && (
                  <Link to="/" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-primary text-sm font-bold no-underline rounded-xl bg-primary/5">
                    Discover
                  </Link>
                )}
                <Link to="/listing" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-on-surface/80 text-sm font-medium no-underline rounded-xl hover:bg-surface-container-low transition-all">
                  Explore stays
                </Link>
                <Link to="/listing/new" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-on-surface/80 text-sm font-medium no-underline rounded-xl hover:bg-surface-container-low transition-all">
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
