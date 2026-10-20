import React, { useState, useEffect, useMemo } from 'react';
import { SmartImage } from '@/components/SmartImage';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck, CalendarClock, CalendarX2, DollarSign, Search, ChevronDown, Download,
  RefreshCw, Moon, Users, ArrowUpRight, Inbox, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminAPI } from '../api';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/animate-ui/components/radix/sheet';

// ── helpers ───────────────────────────────────────────────────────────

const formatDate = (d, opts = {}) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...opts });

const formatShort = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatMoney = (n) => `$${Math.round(Number(n || 0)).toLocaleString('en-US')}`;

const plural = (n, word) => `${n} ${word}${n !== 1 ? 's' : ''}`;

// Where a booking sits relative to today.
const bookingState = (b) => {
  if (b.status === 'cancelled') return 'cancelled';
  const now = new Date();
  if (new Date(b.checkOut) <= now) return 'past';
  if (new Date(b.checkIn) <= now) return 'active';
  return 'upcoming';
};

const STATES = {
  upcoming:  { label: 'Upcoming',    pill: 'bg-primary/10 text-primary',                                   dot: 'bg-primary' },
  active:    { label: 'Staying now', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',    dot: 'bg-emerald-500' },
  past:      { label: 'Completed',   pill: 'bg-surface-container-high text-on-surface-variant',           dot: 'bg-on-surface-variant/60' },
  cancelled: { label: 'Cancelled',   pill: 'bg-destructive/10 text-destructive',                          dot: 'bg-destructive' },
};

const TABS = [
  { value: '',          label: 'All' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'active',    label: 'Staying now' },
  { value: 'past',      label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const SORTS = [
  { value: 'newest',   label: 'Newest booked',    fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { value: 'checkin',  label: 'Check-in date',    fn: (a, b) => new Date(a.checkIn) - new Date(b.checkIn) },
  { value: 'amount',   label: 'Highest amount',   fn: (a, b) => b.totalPrice - a.totalPrice },
];

const AVATAR_COLORS = ['bg-primary/15 text-primary', 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  'bg-amber-500/15 text-amber-700 dark:text-amber-300', 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  'bg-violet-500/15 text-violet-700 dark:text-violet-300'];

const avatarColor = (name = '') =>
  AVATAR_COLORS[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

// ── small pieces ──────────────────────────────────────────────────────

const StatusPill = ({ state }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATES[state].pill}`}>
    <span className={`size-1.5 rounded-full ${STATES[state].dot}`} />
    {STATES[state].label}
  </span>
);

const GuestAvatar = ({ name, size = 'size-9' }) => (
  <div className={`${size} rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor(name)}`}>
    {(name?.[0] || '?').toUpperCase()}
  </div>
);

const ListingThumb = ({ listing, size = 'size-12' }) =>
  listing?.image ? (
    <SmartImage width={96} src={listing.image} alt="" className={`${size} rounded-lg object-cover shrink-0 bg-surface-container`} />
  ) : (
    <div className={`${size} rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant`}>
      <X className="size-4" />
    </div>
  );

const StatCard = ({ icon: Icon, label, value, hint, tone }) => (
  <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 md:p-5 flex flex-col gap-3 md:gap-4 min-w-0">
    <div className="flex items-center justify-between">
      <span className="text-xs md:text-sm font-medium text-on-surface-variant truncate">{label}</span>
      <span className={`size-8 md:size-9 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
        <Icon className="size-4.5" />
      </span>
    </div>
    <div>
      <p className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1 leading-none truncate">{value}</p>
      <p className="text-xs text-on-surface-variant mb-0 line-clamp-2">{hint}</p>
    </div>
  </div>
);

// ── page ──────────────────────────────────────────────────────────────

export const AdminBookings = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tab, setTab] = useState('');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/user/login'); return; }
    if (!user.isAdmin) { navigate('/'); return; }
    fetchBookings();
  }, [user, authLoading, navigate]);

  const fetchBookings = async (refresh = false) => {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      const res = await adminAPI.getBookings();
      setBookings((res.data.bookings || []).map((b) => ({ ...b, state: bookingState(b) })));
    } catch {
      addToast('error', 'Failed to load bookings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const counts = useMemo(() => {
    const c = { '': bookings.length, upcoming: 0, active: 0, past: 0, cancelled: 0 };
    bookings.forEach((b) => { c[b.state] += 1; });
    return c;
  }, [bookings]);

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.state !== 'cancelled');
    const revenue = confirmed.reduce((s, b) => s + b.totalPrice, 0);
    const nights = confirmed.reduce((s, b) => s + b.nights, 0);
    const nextUp = bookings
      .filter((b) => b.state === 'upcoming')
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))[0];
    const cancelRate = bookings.length ? Math.round((counts.cancelled / bookings.length) * 100) : 0;
    return { revenue, nights, nextUp, cancelRate, avg: confirmed.length ? revenue / confirmed.length : 0 };
  }, [bookings, counts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => !tab || b.state === tab)
      .filter((b) => !q || [b.listing?.title, b.listing?.location, b.guest?.username, b.guest?.email]
        .some((v) => v?.toLowerCase().includes(q)))
      .sort(SORTS.find((s) => s.value === sortBy).fn);
  }, [bookings, tab, query, sortBy]);

  const exportCsv = () => {
    const rows = [
      ['Booking ID', 'Listing', 'Location', 'Guest', 'Email', 'Check-in', 'Check-out', 'Nights', 'Guests', 'Total', 'Status', 'Booked on'],
      ...visible.map((b) => [
        b._id, b.listing?.title || 'Deleted listing',
        [b.listing?.location, b.listing?.country].filter(Boolean).join(', '),
        b.guest?.username || '', b.guest?.email || '',
        formatDate(b.checkIn), formatDate(b.checkOut), b.nights, b.guests, b.totalPrice,
        STATES[b.state].label, formatDate(b.createdAt),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'horizn-bookings.csv' });
    a.click();
    URL.revokeObjectURL(url);
  };

  const loading = authLoading || isLoading;

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-[1880px] mx-auto px-6 md:px-10 xl:px-12 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Admin</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-1.5">Bookings</h1>
            <p className="text-on-surface-variant text-sm mb-0">Track every reservation made across Horizn.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => fetchBookings(true)}
              disabled={isRefreshing}
              className="h-10 px-4 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest text-sm font-semibold text-on-surface cursor-pointer hover:border-on-surface transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={exportCsv}
              disabled={!visible.length}
              className="h-10 px-4 inline-flex items-center gap-2 rounded-full border-0 bg-primary text-on-primary text-sm font-semibold cursor-pointer shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
            >
              <Download className="size-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
          {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-30 md:h-34 rounded-2xl" />) : (
            <>
              <StatCard icon={CalendarCheck} label="Total bookings" value={bookings.length}
                hint={`${plural(stats.nights, 'night')} booked`} tone="bg-sky-500/10 text-sky-700 dark:text-sky-300" />
              <StatCard icon={CalendarClock} label="Upcoming" value={counts.upcoming}
                hint={stats.nextUp ? `Next check-in ${formatShort(stats.nextUp.checkIn)}` : 'No upcoming stays'}
                tone="bg-primary/10 text-primary" />
              <StatCard icon={CalendarX2} label="Cancelled" value={counts.cancelled}
                hint={`${stats.cancelRate}% cancellation rate`} tone="bg-destructive/10 text-destructive" />
              <StatCard icon={DollarSign} label="Revenue" value={formatMoney(stats.revenue)}
                hint={`${formatMoney(stats.avg)} avg per booking`} tone="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" />
            </>
          )}
        </div>

        {/* Table panel */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-4 md:px-5 pt-3 pb-3 lg:pb-0 border-b border-outline-variant/40">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
              {TABS.map((t) => {
                const active = tab === t.value;
                return (
                  <button
                    key={t.value || 'all'}
                    onClick={() => setTab(t.value)}
                    className={`relative shrink-0 px-3 py-3 text-sm font-semibold bg-transparent border-0 cursor-pointer inline-flex items-center gap-2 transition-colors ${active ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {t.label}
                    <span className={`min-w-5 px-1.5 py-0.5 rounded-full text-[11px] leading-none ${active ? 'bg-on-surface text-surface' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {counts[t.value]}
                    </span>
                    {active && <span className="absolute left-2 right-2 bottom-0 h-0.5 rounded-full bg-on-surface" />}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:ml-auto lg:pb-2">
              <div className="relative w-full sm:flex-1 lg:w-72 lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search guest, email or listing"
                  className="h-9 rounded-lg pl-9 bg-surface border-outline-variant/60"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 px-3 inline-flex items-center justify-between sm:justify-start gap-1.5 w-full sm:w-auto rounded-lg border border-outline-variant/60 bg-surface text-sm text-on-surface cursor-pointer whitespace-nowrap hover:border-on-surface transition-colors">
                    <span className="text-on-surface-variant hidden sm:inline">Sort:</span>
                    <span className="font-semibold">{SORTS.find((s) => s.value === sortBy).label}</span>
                    <ChevronDown className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {SORTS.map((s) => (
                    <DropdownMenuItem key={s.value} onSelect={() => setSortBy(s.value)} className="cursor-pointer">
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="p-5 flex flex-col gap-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center px-6">
              <div className="size-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                <Inbox className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-on-surface mb-1">No bookings found</p>
                <p className="text-sm text-on-surface-variant mb-0">
                  {query ? 'Try a different search term.' : 'Bookings in this category will show up here.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/60 text-left text-xs uppercase tracking-wide text-on-surface-variant">
                      <th className="font-semibold px-5 py-3">Listing</th>
                      <th className="font-semibold px-4 py-3">Guest</th>
                      <th className="font-semibold px-4 py-3">Stay</th>
                      <th className="font-semibold px-4 py-3">Booked</th>
                      <th className="font-semibold px-4 py-3">Status</th>
                      <th className="font-semibold px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((b) => (
                      <tr
                        key={b._id}
                        onClick={() => setSelected(b)}
                        className="border-t border-outline-variant/30 cursor-pointer hover:bg-surface-container-low/60 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <ListingThumb listing={b.listing} />
                            <div className="min-w-0">
                              <p className={`font-semibold truncate max-w-64 mb-0.5 ${b.listing ? 'text-on-surface' : 'text-on-surface-variant italic'}`}>
                                {b.listing?.title || 'Deleted listing'}
                              </p>
                              <p className="text-xs text-on-surface-variant truncate max-w-64 mb-0">
                                {[b.listing?.location, b.listing?.country].filter(Boolean).join(', ') || '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <GuestAvatar name={b.guest?.username} />
                            <div className="min-w-0">
                              <p className="font-semibold text-on-surface truncate max-w-48 mb-0.5">{b.guest?.username || 'Deleted user'}</p>
                              <p className="text-xs text-on-surface-variant truncate max-w-48 mb-0">{b.guest?.email || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="font-medium text-on-surface mb-0.5">{formatShort(b.checkIn)} – {formatDate(b.checkOut)}</p>
                          <p className="text-xs text-on-surface-variant mb-0">{plural(b.nights, 'night')} · {plural(b.guests, 'guest')}</p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-on-surface-variant">{formatDate(b.createdAt)}</td>
                        <td className="px-4 py-3.5"><StatusPill state={b.state} /></td>
                        <td className={`px-5 py-3.5 text-right font-semibold tabular-nums whitespace-nowrap ${b.state === 'cancelled' ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                          {formatMoney(b.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet cards */}
              <div className="lg:hidden divide-y divide-outline-variant/30">
                {visible.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => setSelected(b)}
                    className="w-full text-left bg-transparent border-0 cursor-pointer p-4 flex gap-3 hover:bg-surface-container-low/60 transition-colors"
                  >
                    <ListingThumb listing={b.listing} size="size-16" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-on-surface truncate mb-0">{b.listing?.title || 'Deleted listing'}</p>
                        <span className={`font-semibold tabular-nums shrink-0 ${b.state === 'cancelled' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                          {formatMoney(b.totalPrice)}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-2">
                        {formatShort(b.checkIn)} – {formatShort(b.checkOut)} · {b.guest?.username || 'Deleted user'}
                      </p>
                      <StatusPill state={b.state} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-outline-variant/30 text-xs text-on-surface-variant">
                Showing {visible.length} of {plural(bookings.length, 'booking')}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Booking detail drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="p-0 w-full sm:max-w-112 overflow-y-auto [&>button]:z-10 [&>button]:bg-white/90 [&>button]:p-1.5 [&>button]:rounded-full [&>button]:opacity-100 [&>button]:text-black">
          {selected && (
            <>
              <div className="relative h-48 bg-surface-container">
                {selected.listing?.image && <SmartImage width={900} src={selected.listing.image} alt="" className="w-full h-full object-cover" />}
                <div className="absolute left-4 bottom-4"><StatusPill state={selected.state} /></div>
              </div>
              <SheetHeader className="px-6 pt-5 pb-0">
                <SheetTitle className="font-heading text-xl font-bold text-on-surface">
                  {selected.listing?.title || 'Deleted listing'}
                </SheetTitle>
                <SheetDescription className="text-on-surface-variant">
                  {[selected.listing?.location, selected.listing?.country].filter(Boolean).join(', ') || 'This listing has been removed'}
                </SheetDescription>
              </SheetHeader>

              <div className="px-6 py-5 flex flex-col gap-5">
                <div className="grid grid-cols-2 rounded-xl border border-outline-variant/40 overflow-hidden">
                  <div className="p-4 border-r border-outline-variant/40">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant mb-1">Check-in</p>
                    <p className="font-semibold text-on-surface mb-0">{formatDate(selected.checkIn, { weekday: 'short' })}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant mb-1">Check-out</p>
                    <p className="font-semibold text-on-surface mb-0">{formatDate(selected.checkOut, { weekday: 'short' })}</p>
                  </div>
                </div>

                <div className="flex gap-6 text-sm text-on-surface">
                  <span className="inline-flex items-center gap-2"><Moon className="size-4 text-on-surface-variant" />{plural(selected.nights, 'night')}</span>
                  <span className="inline-flex items-center gap-2"><Users className="size-4 text-on-surface-variant" />{plural(selected.guests, 'guest')}</span>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant mb-2">Guest</p>
                  <div className="flex items-center gap-3">
                    <GuestAvatar name={selected.guest?.username} size="size-11" />
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface mb-0.5">{selected.guest?.username || 'Deleted user'}</p>
                      {selected.guest?.email && (
                        <a href={`mailto:${selected.guest.email}`} className="text-sm text-primary no-underline hover:underline truncate block">
                          {selected.guest.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-surface-container-low p-4 flex flex-col gap-2 text-sm">
                  {selected.listing?.price != null && (
                    <div className="flex justify-between text-on-surface-variant">
                      <span>{formatMoney(selected.listing.price)} × {plural(selected.nights, 'night')}</span>
                      <span className="tabular-nums">{formatMoney(selected.listing.price * selected.nights)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-on-surface pt-2 border-t border-outline-variant/40">
                    <span>Total paid</span>
                    <span className={`tabular-nums ${selected.state === 'cancelled' ? 'line-through text-on-surface-variant' : ''}`}>
                      {formatMoney(selected.totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-on-surface-variant flex flex-col gap-1">
                  <span>Booked on {formatDate(selected.createdAt, { hour: 'numeric', minute: '2-digit' })}</span>
                  <span className="font-mono break-all">ID {selected._id}</span>
                </div>

                {selected.listing && (
                  <Link
                    to={`/listings/${selected.listing._id}`}
                    className="h-11 inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant text-sm font-semibold text-on-surface no-underline hover:border-on-surface transition-colors"
                  >
                    View listing <ArrowUpRight className="size-4" />
                  </Link>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
