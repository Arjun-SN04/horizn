import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Star, Pencil, Trash2, CalendarDays, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { listingsAPI, bookingsAPI } from '../api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/animate-ui/components/buttons/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/animate-ui/components/radix/alert-dialog';

const getAvgRating = (listing) => listing.reviews?.length
  ? listing.reviews.reduce((s, r) => s + (r.rating || 0), 0) / listing.reviews.length
  : null;

export const MyListings = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [listings, setListings] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/user/login'); return; }
    fetchData();
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [listingsRes, bookingsRes] = await Promise.all([
        listingsAPI.getAllListings({ owner: user._id }),
        bookingsAPI.getHostBookings(),
      ]);
      setListings(listingsRes.data.allListings || []);
      setHostBookings(bookingsRes.data.bookings || []);
    } catch {
      addToast('error', 'Failed to load your listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await listingsAPI.deleteListing(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
      addToast('success', 'Listing deleted');
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeletingId(null);
    }
  };

  const upcomingCountFor = (listingId) => {
    const today = new Date();
    return hostBookings.filter((b) => b.listing?._id === listingId && new Date(b.checkIn) >= today).length;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="flex justify-between items-start gap-4 mb-xl flex-wrap">
          <div>
            <h1 className="font-heading text-headline-lg text-on-surface mb-2">Your Listings</h1>
            <p className="text-on-surface-variant text-body-sm mb-0">
              {listings.length > 0 ? `${listings.length} listing${listings.length !== 1 ? 's' : ''}` : 'Manage the stays you host.'}
            </p>
          </div>
          <Button asChild className="rounded-full bg-primary text-on-primary font-bold border-0 shadow-sm">
            <Link to="/listing/new"><Plus className="size-4" /> Add a listing</Link>
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-md py-24 bg-surface-container-lowest">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <Compass className="size-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-on-surface mb-1">You haven't listed any stays yet</p>
              <p className="text-on-surface-variant text-body-sm mb-0">Share your space and start earning by welcoming travelers.</p>
            </div>
            <Button asChild className="mt-2 rounded-full bg-primary text-on-primary font-semibold border-0 shadow-sm">
              <Link to="/listing/new"><Plus className="size-4" /> Create your first listing</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {listings.map((listing) => {
              const avgRating = getAvgRating(listing);
              const upcoming = upcomingCountFor(listing._id);
              return (
                <Card key={listing._id} className="overflow-hidden shadow-sm border-outline-variant/30 p-0 gap-0">
                  <Link to={`/listings/${listing._id}`} className="block h-44 overflow-hidden relative group">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {upcoming > 0 && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-label-sm font-bold shadow-sm text-black flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-primary" /> {upcoming} upcoming
                      </div>
                    )}
                  </Link>
                  <div className="p-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase mb-0.5">{listing.location}, {listing.country}</p>
                    <h3 className="font-heading text-headline-md text-on-surface mb-1 truncate">{listing.title}</h3>
                    <div className="flex items-center justify-between mb-lg">
                      <p className="text-on-surface font-bold mb-0">${listing.price.toLocaleString('en-US')} <span className="font-normal text-body-sm text-on-surface-variant">night</span></p>
                      {avgRating !== null ? (
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <Star className="size-3.5 fill-primary text-primary" />
                          <span>{avgRating.toFixed(1)}</span>
                          <span className="text-on-surface-variant font-normal">({listing.reviews.length})</span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant text-body-sm">No reviews yet</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1 rounded-full border-outline-variant">
                        <Link to={`/listings/${listing._id}/edit`}>
                          <Pencil className="size-3.5" /> Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={deletingId === listing._id} className="rounded-full">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                            <AlertDialogDescription>This action can't be undone. This will permanently delete "{listing.title}" and its reviews.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(listing._id)} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
