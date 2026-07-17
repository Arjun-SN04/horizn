import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star } from 'lucide-react';
import { listingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { LikeButton } from '../components/LikeButton';

const CATEGORIES = [
  'Cabins', 'Beachfront', 'Amazing views', 'Top cities',
  'Amazing pools', 'Castles', 'Vineyards', 'National parks',
];

const getAvgRating = (listing) => listing.reviews?.length
  ? listing.reviews.reduce((s, r) => s + (r.rating || 0), 0) / listing.reviews.length
  : null;

const destinations = [
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
  { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
  { name: 'Maldives', country: 'Maldives', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
  { name: 'Tuscany', country: 'Italy', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80' },
  { name: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
];

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Cabins');
  const [stays, setStays] = useState([]);

  useEffect(() => {
    listingsAPI.getAllListings()
      .then((res) => setStays(res.data.allListings.slice(0, 8)))
      .catch(() => setStays([]));
  }, []);

  const formatPrice = (p) => p.toLocaleString('en-US');

  return (
    <div className="bg-surface font-sans">
      {/* ── HERO ── */}
      <section className="relative h-180 min-h-140 w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-4xl px-margin-mobile">
          <div className="text-center mb-10">
            <h1 className="font-heading text-display-lg text-white drop-shadow-lg mb-4">
              Find your next sanctuary.
            </h1>
            <p className="text-white/85 text-body-lg drop-shadow">
              {user ? `Welcome back, ${user.username} — ready for your next adventure?` : 'Discover unique stays and inspiring experiences worldwide'}
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); navigate(search.trim() ? `/listing?search=${encodeURIComponent(search.trim())}` : '/listing'); }}
            className="glass-effect p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/30"
          >
            <div className="flex-1 w-full px-6 py-2 hover:bg-surface-container/50 rounded-full transition-colors">
              <p className="text-label-sm text-on-surface">Location</p>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none p-0 text-body-sm outline-none w-full placeholder:text-on-surface-variant text-on-surface"
                placeholder="Search destinations"
                type="text"
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-outline-variant" />
            <div className="flex-1 w-full px-6 py-2 rounded-full">
              <p className="text-label-sm text-on-surface">Check in</p>
              <p className="text-body-sm text-on-surface-variant mb-0">Add dates</p>
            </div>
            <div className="hidden md:block w-px h-8 bg-outline-variant" />
            <div className="flex-1 w-full px-6 py-2 rounded-full">
              <p className="text-label-sm text-on-surface">Check out</p>
              <p className="text-body-sm text-on-surface-variant mb-0">Add dates</p>
            </div>
            <div className="hidden md:block w-px h-8 bg-outline-variant" />
            <div className="flex-1 w-full px-6 py-2 rounded-full">
              <p className="text-label-sm text-on-surface">Guests</p>
              <p className="text-body-sm text-on-surface-variant mb-0">Add guests</p>
            </div>
            <button type="submit" className="bg-primary hover:bg-primary/90 text-on-primary w-full md:w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 shrink-0">
              <Search className="size-5" />
            </button>
          </form>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="flex items-center gap-xl overflow-x-auto scrollbar-hide py-2">
          {CATEGORIES.map((label) => {
            const active = activeCategory === label;
            return (
              <Link
                key={label}
                to={`/listing?search=${encodeURIComponent(label)}`}
                onClick={() => setActiveCategory(label)}
                className={`min-w-fit pb-2 border-b-2 no-underline text-sm font-medium transition-all ${active ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface'}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── STAYS GRID ── */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xxl">
        <div className="flex justify-between items-end mb-lg flex-wrap gap-3">
          <h2 className="text-headline-lg text-on-surface">Stays for every mood</h2>
          <Link to="/listing" className="text-primary font-semibold text-sm no-underline flex items-center gap-1.5">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {stays.map((listing) => {
            const avgRating = getAvgRating(listing);
            return (
              <Link key={listing._id} to={`/listings/${listing._id}`} className="group no-underline text-inherit block">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-md shadow-sm group-hover:shadow-lg transition-all duration-300">
                  <img src={listing.image} alt={listing.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <LikeButton
                    listingId={listing._id}
                    className="absolute top-3 right-3 glass-effect w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    iconClassName="text-on-surface size-4"
                  />
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-heading font-bold text-on-surface text-sm mb-0.5 truncate">{listing.location}, {listing.country}</h3>
                    <p className="text-on-surface-variant text-body-sm mb-0 truncate">{listing.title}</p>
                    <p className="mt-2 text-on-surface font-bold text-headline-md">
                      ${formatPrice(listing.price)} <span className="font-normal text-body-sm text-on-surface-variant">night</span>
                    </p>
                  </div>
                  {avgRating !== null && (
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <Star className="size-3.5 fill-primary text-primary" />
                      <span className="text-body-sm font-semibold">{avgRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── INSPIRING DESTINATIONS ── */}
      <section className="bg-surface-container-low py-xxl">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-lg">
          <h2 className="text-headline-lg text-on-surface mb-xxl text-center">Inspiring destinations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-lg justify-items-center">
            {destinations.map((d) => (
              <Link key={d.name} to={`/listing?search=${encodeURIComponent(d.name)}`} className="flex flex-col items-center gap-md group no-underline">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-md group-hover:scale-105 transition-transform duration-300">
                  <img src={d.img} alt={d.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-on-surface mb-0">{d.name}</p>
                  <p className="text-body-sm text-on-surface-variant mb-0">{d.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOST CTA ── */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xxl">
        <div className="relative w-full rounded-3xl overflow-hidden min-h-105 flex items-center">
          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&q=80"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/65 to-transparent" />
          <div className="relative z-10 p-xl md:p-xxl max-w-144">
            {user ? (
              <>
                <h2 className="font-heading text-white text-display-lg mb-md leading-tight">Ready to host your first stay?</h2>
                <p className="text-white text-body-lg mb-xl opacity-90">
                  List your space in minutes and start earning by welcoming travelers from around the world.
                </p>
                <Button asChild size="lg" className="bg-white text-on-surface hover:bg-surface-container-low font-bold shadow-xl border-0 rounded-xl px-8">
                  <Link to="/listing/new">Become a host</Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="font-heading text-white text-display-lg mb-md leading-tight">Try hosting with Horizn</h2>
                <p className="text-white text-body-lg mb-xl opacity-90">
                  Earn extra income and share your unique space with travelers from around the world. We provide the tools and support you need to succeed.
                </p>
                <Button asChild size="lg" className="bg-white text-on-surface hover:bg-surface-container-low font-bold shadow-xl border-0 rounded-xl px-8">
                  <Link to="/user/signup">Learn more</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
