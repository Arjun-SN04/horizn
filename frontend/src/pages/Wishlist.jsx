import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { LikeButton } from '../components/LikeButton';
import { Button } from '@/components/animate-ui/components/buttons/button';

export const Wishlist = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/user/login');
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="mb-xl">
          <h1 className="font-heading text-headline-lg text-on-surface mb-2">Your Wishlist</h1>
          <p className="text-on-surface-variant text-body-sm mb-0">
            {favorites.length > 0
              ? `${favorites.length} saved stay${favorites.length !== 1 ? 's' : ''}`
              : 'Stays you save will show up here.'}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-md py-24 bg-surface-container-lowest">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <Heart className="size-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-on-surface mb-1">No saved stays yet</p>
              <p className="text-on-surface-variant text-body-sm mb-0">Tap the heart on any stay to save it here for later.</p>
            </div>
            <Button asChild className="mt-2 rounded-full bg-primary text-on-primary font-semibold border-0 shadow-sm">
              <Link to="/listing"><Compass className="size-4" /> Explore stays</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
            {favorites.map((listing) => (
              <Link key={listing._id} to={`/listings/${listing._id}`} className="group relative h-64 rounded-2xl overflow-hidden shadow-sm block no-underline">
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent z-10" />
                <img src={listing.image} alt={listing.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <LikeButton
                  listingId={listing._id}
                  className="absolute top-3 right-3 z-20 glass-effect w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  iconClassName="text-white size-4.5"
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="font-heading text-headline-md">{listing.location}, {listing.country}</h3>
                  <p className="text-body-sm opacity-80 mb-0">${listing.price.toLocaleString('en-US')} / night</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
