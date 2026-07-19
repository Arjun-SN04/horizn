import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, MotionConfig } from 'motion/react';
import { Search, ArrowRight, Star } from 'lucide-react';
import { listingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { getRecentlyViewed } from '../lib/recentlyViewed';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { LikeButton } from '../components/LikeButton';
import { ScrollReveal, StaggerGroup, StaggerItem } from '../components/ScrollReveal';

const EASE = [0.22, 1, 0.36, 1];

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

const heroTextVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: EASE } }),
};

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Cabins');
  const [stays, setStays] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    listingsAPI.getAllListings()
      .then((res) => setStays(res.data.allListings.slice(0, 8)))
      .catch(() => setStays([]));
    setRecentlyViewed(getRecentlyViewed());
  }, []);

  const formatPrice = (p) => p.toLocaleString('en-US');

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-surface font-sans">
        {/* ── HERO ── */}
        <section ref={heroRef} className="relative h-[88vh] min-h-[660px] lg:min-h-[740px] w-full flex items-center justify-center overflow-hidden pt-28 pb-16">
          <motion.div className="absolute inset-0 z-0" style={{ y: heroImageY }}>
            <motion.img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
              alt=""
              className="w-full h-full object-cover"
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/65" />
          </motion.div>

          <motion.div
            className="relative z-10 w-full max-w-4xl px-margin-mobile"
            style={{ y: heroContentY, opacity: heroContentOpacity }}
          >
            <div className="text-center mb-12">
              <motion.h1
                custom={0}
                initial="hidden"
                animate="visible"
                variants={heroTextVariants}
                className="font-heading text-display-lg md:text-[3.75rem] font-bold text-white drop-shadow-xl mb-5 leading-tight tracking-tight"
              >
                Find your next sanctuary.
              </motion.h1>
              <motion.p
                custom={0.15}
                initial="hidden"
                animate="visible"
                variants={heroTextVariants}
                className="text-white/90 text-body-lg md:text-xl max-w-2xl mx-auto drop-shadow font-normal"
              >
                {user ? `Welcome back, ${user.username} — ready for your next adventure?` : 'Discover unique stays and inspiring experiences worldwide'}
              </motion.p>
            </div>

            <motion.form
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
              onSubmit={(e) => { e.preventDefault(); navigate(search.trim() ? `/listing?search=${encodeURIComponent(search.trim())}` : '/listing'); }}
              className="p-2.5 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/40 backdrop-blur-xl bg-white/90 text-neutral-900 dark:bg-black/50 dark:text-white dark:border-white/20"
            >
              <div className="flex-1 w-full px-6 py-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                <p className="text-label-sm text-neutral-900 dark:text-white/90 font-bold">Location</p>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none p-0 text-body-sm outline-none w-full placeholder:text-neutral-500 dark:placeholder:text-white/60 text-neutral-900 dark:text-white font-medium"
                  placeholder="Search destinations"
                  type="text"
                />
              </div>
              <div className="hidden md:block w-px h-8 bg-neutral-300 dark:bg-white/20" />
              <div className="flex-1 w-full px-6 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <p className="text-label-sm text-neutral-900 dark:text-white/90 font-bold">Check in</p>
                <p className="text-body-sm text-neutral-600 dark:text-white/70 mb-0 font-medium">Add dates</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-neutral-300 dark:bg-white/20" />
              <div className="flex-1 w-full px-6 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <p className="text-label-sm text-neutral-900 dark:text-white/90 font-bold">Check out</p>
                <p className="text-body-sm text-neutral-600 dark:text-white/70 mb-0 font-medium">Add dates</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-neutral-300 dark:bg-white/20" />
              <div className="flex-1 w-full px-6 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <p className="text-label-sm text-neutral-900 dark:text-white/90 font-bold">Guests</p>
                <p className="text-body-sm text-neutral-600 dark:text-white/70 mb-0 font-medium">Add guests</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                type="submit"
                className="bg-primary hover:bg-primary/90 text-on-primary w-full md:w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-lg shrink-0"
              >
                <Search className="size-5" />
              </motion.button>
            </motion.form>
          </motion.div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xl">
          <StaggerGroup className="flex items-center gap-xl overflow-x-auto scrollbar-hide py-2" stagger={0.04}>
            {CATEGORIES.map((label) => {
              const active = activeCategory === label;
              return (
                <StaggerItem key={label} variant="up" className="min-w-fit">
                  <Link
                    to={`/listing?search=${encodeURIComponent(label)}`}
                    onClick={() => setActiveCategory(label)}
                    className={`min-w-fit pb-2 relative no-underline text-sm transition-colors duration-200 ${
                      active
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant font-medium hover:text-primary'
                    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full after:transition-transform after:duration-200 after:ease-out ${
                      active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    {label}
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </section>

        {/* ── STAYS GRID ── */}
        <section className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xxl">
          <ScrollReveal className="flex justify-between items-end mb-lg flex-wrap gap-3">
            <h2 className="text-headline-lg text-on-surface">Stays for every mood</h2>
            <Link to="/listing" className="text-primary font-semibold text-sm no-underline flex items-center gap-1.5 group">
              View all <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter" stagger={0.07}>
            {stays.map((listing) => {
              const avgRating = getAvgRating(listing);
              return (
                <StaggerItem key={listing._id} variant="up">
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: EASE }}>
                    <Link to={`/listings/${listing._id}`} className="group no-underline text-inherit block">
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-md shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                        <img src={listing.image} alt={listing.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <LikeButton
                          listingId={listing._id}
                          className="absolute top-3 right-3 glass-effect w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                          iconClassName="text-on-surface size-4"
                        />
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
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
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </section>

        {/* ── RECENTLY VIEWED ── */}
        {recentlyViewed.length > 0 && (
          <section className="max-w-7xl mx-auto px-margin-mobile md:px-lg pb-xxl">
            <ScrollReveal className="flex justify-between items-end mb-lg flex-wrap gap-3">
              <h2 className="text-headline-lg text-on-surface">Pick up where you left off</h2>
            </ScrollReveal>
            <StaggerGroup className="flex gap-gutter overflow-x-auto scrollbar-hide pb-2" stagger={0.06}>
              {recentlyViewed.map((listing) => (
                <StaggerItem key={listing._id} variant="right" className="shrink-0 w-56">
                  <Link
                    to={`/listings/${listing._id}`}
                    className="group no-underline text-inherit block"
                  >
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-md shadow-sm group-hover:shadow-lg transition-all duration-300">
                      <img src={listing.image} alt={listing.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <LikeButton
                        listingId={listing._id}
                        className="absolute top-3 right-3 glass-effect w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        iconClassName="text-on-surface size-4"
                      />
                    </div>
                    <h3 className="font-heading font-bold text-on-surface text-sm mb-0.5 truncate">{listing.location}, {listing.country}</h3>
                    <p className="text-on-surface font-bold text-body-sm mb-0">
                      ${formatPrice(listing.price)} <span className="font-normal text-on-surface-variant">night</span>
                    </p>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}

        {/* ── INSPIRING DESTINATIONS ── */}
        <section className="bg-surface-container-low py-xxl">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-lg">
            <ScrollReveal>
              <h2 className="text-headline-lg text-on-surface mb-xxl text-center">Inspiring destinations</h2>
            </ScrollReveal>
            <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-lg justify-items-center" stagger={0.06}>
              {destinations.map((d) => (
                <StaggerItem key={d.name} variant="scale">
                  <Link to={`/listing?search=${encodeURIComponent(d.name)}`} className="flex flex-col items-center gap-md group no-underline">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-md"
                    >
                      <img src={d.img} alt={d.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-bold text-on-surface mb-0">{d.name}</p>
                      <p className="text-body-sm text-on-surface-variant mb-0">{d.country}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* ── HOST CTA ── */}
        <section className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xxl">
          <ScrollReveal duration={0.7} amount={0.3}>
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
                    <Button asChild size="lg" className="bg-white text-black hover:bg-neutral-100 font-bold shadow-xl border-0 rounded-xl px-8">
                      <Link to="/listing/new">Become a host</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="font-heading text-white text-display-lg mb-md leading-tight">Try hosting with Horizn</h2>
                    <p className="text-white text-body-lg mb-xl opacity-90">
                      Earn extra income and share your unique space with travelers from around the world. We provide the tools and support you need to succeed.
                    </p>
                    <Button asChild size="lg" className="bg-white text-black hover:bg-neutral-100 font-bold shadow-xl border-0 rounded-xl px-8">
                      <Link to="/user/signup">Learn more</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </MotionConfig>
  );
};
