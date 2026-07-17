import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, Star, MapPin, Users, BedDouble, Bath, ShieldCheck,
  CalendarClock, Wifi, Waves, ChefHat, Car, Wind, LayoutGrid, Flag,
} from 'lucide-react';
import { listingsAPI, reviewsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/animate-ui/components/buttons/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/animate-ui/components/radix/alert-dialog';
import { LikeButton } from '../components/LikeButton';

const GALLERY_FILLERS = [
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
];

const AMENITIES = [
  { icon: Waves, label: 'Ocean / garden view' },
  { icon: Wifi, label: 'Fast Wi-Fi' },
  { icon: ChefHat, label: 'Fully-equipped kitchen' },
  { icon: Car, label: 'Free parking on premises' },
  { icon: Wind, label: 'Central air conditioning' },
];

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'Great host', desc: 'Experienced hosts committed to providing great stays for guests.' },
  { icon: MapPin, title: 'Great location', desc: '100% of recent guests gave the location a 5-star rating.' },
  { icon: CalendarClock, title: 'Free cancellation for 48 hours', desc: 'Get a full refund if you change your mind within two days of booking.' },
];

export const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [reviewErrors, setReviewErrors] = useState({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchListing(); }, [id]);

  useEffect(() => {
    if (listing?.geometry && !mapInitialized) {
      // Small delay to ensure DOM element is rendered
      const t = setTimeout(() => initializeMap(), 100);
      return () => clearTimeout(t);
    }
  }, [listing, mapInitialized]);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      const response = await listingsAPI.getListingById(id);
      setListing(response.data.listing);
    } catch (err) {
      setError('Failed to load listing');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = () => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      console.warn('Mapbox token not found in environment variables');
      return;
    }
    const el = document.getElementById('map');
    if (!el) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: el,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: listing.geometry.coordinates,
      zoom: 12
    });
    new mapboxgl.Marker({ color: '#ba0036' })
      .setLngLat(listing.geometry.coordinates)
      .addTo(map);
    setMapInitialized(true);
  };

  const validateReview = () => {
    const e = {};
    if (!reviewData.rating || reviewData.rating === '0') e.rating = 'Please select a rating.';
    if (!reviewData.comment.trim()) e.comment = 'Please provide a comment.';
    setReviewErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
    if (reviewErrors[name]) setReviewErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!validateReview()) return;
    setIsSubmittingReview(true);
    try {
      await reviewsAPI.addReview(id, { review: { rating: reviewData.rating, comment: reviewData.comment } });
      setReviewData({ rating: 0, comment: '' });
      fetchListing();
    } catch (err) {
      setReviewErrors({ submit: err.response?.data?.message || 'Failed to add review' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try { await reviewsAPI.deleteReview(id, reviewId); fetchListing(); } catch (err) {}
  };

  const handleDeleteListing = async () => {
    try { await listingsAPI.deleteListing(id); navigate('/listing'); } catch (err) {}
  };

  if (isLoading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  if (error || !listing) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-on-surface-variant">{error || 'Listing not found'}</p>
        <Link to="/listing" className="mt-4 inline-block text-sm text-primary hover:underline">Back to listings</Link>
      </div>
    </div>
  );

  const isOwner = user && user._id === listing.owner?._id;
  const canReview = user && !isOwner;
  const avgRating = listing.reviews?.length
    ? (listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length).toFixed(1)
    : null;
  const gallery = [listing.image, ...GALLERY_FILLERS];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-lg">
        {/* Title & basic info */}
        <div className="flex items-start justify-between gap-4 mb-lg">
          <div>
            <Link to="/listing" className="inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant no-underline mb-md hover:text-on-surface">
              <ArrowLeft className="size-3.5" /> Back to listings
            </Link>
            <h1 className="font-heading text-headline-lg text-on-surface mb-2">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-md text-body-sm font-semibold">
              {avgRating && (
                <div className="flex items-center gap-1">
                  <Star className="text-primary size-3.5 fill-primary" />
                  <span>{avgRating}</span>
                  <span className="font-normal text-on-surface-variant">· {listing.reviews.length} review{listing.reviews.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              <span className="text-on-surface-variant flex items-center gap-1"><MapPin className="size-3.5" /> {listing.location}, {listing.country}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <LikeButton
              listingId={listing._id}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors"
              iconClassName="size-4.5 text-on-surface"
            />
            {isOwner && (
              <>
                <Button asChild variant="outline" className="rounded-full border-outline-variant">
                  <Link to={`/listings/${listing._id}/edit`}>
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="rounded-full">
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                      <AlertDialogDescription>This action can't be undone. This will permanently delete "{listing.title}".</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteListing} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Bento image gallery */}
        <section className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 rounded-xl overflow-hidden mb-xxl h-70 md:h-105 relative">
          <div className="col-span-2 row-span-2 relative overflow-hidden group">
            <img src={gallery[0]} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          {gallery.slice(1, 5).map((src, i) => (
            <div key={i} className="hidden md:block relative overflow-hidden group">
              <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          ))}
          <button className="absolute bottom-md right-md bg-surface-container-lowest px-4 py-2 rounded-lg border border-on-surface text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-lg">
            <LayoutGrid className="size-3.5" /> Show all photos
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xxl">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Host */}
            <div className="flex justify-between items-start border-b border-outline-variant/30 pb-lg mb-lg">
              <div>
                <h2 className="font-heading text-headline-md text-on-surface mb-1">Hosted by {listing.owner?.username || 'Anonymous'}</h2>
                <p className="text-on-surface-variant text-body-sm flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><Users className="size-3.5" /> 4 guests</span>
                  <span className="flex items-center gap-1"><BedDouble className="size-3.5" /> 2 bedrooms</span>
                  <span className="flex items-center gap-1"><Bath className="size-3.5" /> 1 bath</span>
                </p>
              </div>
              <Avatar size="lg" className="shrink-0">
                <AvatarFallback className="bg-primary text-on-primary font-semibold">
                  {listing.owner?.username?.[0]?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Highlights */}
            <div className="space-y-lg border-b border-outline-variant/30 pb-lg mb-lg">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="flex gap-lg">
                  <h.icon className="text-on-surface size-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-on-surface mb-0.5">{h.title}</p>
                    <p className="text-on-surface-variant text-body-sm mb-0">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-b border-outline-variant/30 pb-lg mb-lg">
              <h2 className="font-heading text-headline-md text-on-surface mb-3">About this place</h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="border-b border-outline-variant/30 pb-lg mb-lg">
              <h2 className="font-heading text-headline-md text-on-surface mb-lg">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {AMENITIES.map((a) => (
                  <div key={a.label} className="flex items-center gap-md text-on-surface">
                    <a.icon className="size-5 text-on-surface-variant" />
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            {listing.geometry && (
              <div className="border-b border-outline-variant/30 pb-lg mb-lg">
                <h2 className="font-heading text-headline-md text-on-surface mb-4">Where you'll be</h2>
                {!import.meta.env.VITE_MAPBOX_TOKEN ? (
                  <div className="rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant text-sm h-80">
                    <span>Map unavailable — Mapbox token not configured</span>
                  </div>
                ) : (
                  <div id="map" className="rounded-xl overflow-hidden h-80" />
                )}
              </div>
            )}

            {/* Review Form */}
            {canReview && (
              <Card className="p-6 mb-lg shadow-none border-outline-variant/30">
                <h2 className="font-heading text-headline-md text-on-surface mb-5">Leave a Review</h2>
                {reviewErrors.submit && (
                  <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">{reviewErrors.submit}</div>
                )}
                <form onSubmit={handleReviewSubmit} noValidate>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-on-surface mb-3">Your rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button"
                          onClick={() => setReviewData(prev => ({ ...prev, rating: star.toString() }))}
                          className="bg-transparent border-0 cursor-pointer p-0 transition-transform hover:scale-110">
                          <Star className={`size-7 ${parseInt(reviewData.rating) >= star ? 'text-primary fill-primary' : 'text-on-surface-variant/30'}`} />
                        </button>
                      ))}
                    </div>
                    {reviewErrors.rating && <p className="text-destructive text-xs mt-1.5">{reviewErrors.rating}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Comment</label>
                    <Textarea name="comment" rows="4" value={reviewData.comment} onChange={handleReviewChange}
                      placeholder="Share your experience..." className="rounded-xl bg-surface-container-low"
                      aria-invalid={!!reviewErrors.comment} />
                    {reviewErrors.comment && <p className="text-destructive text-xs mt-1.5">{reviewErrors.comment}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmittingReview} className="rounded-full bg-primary text-on-primary border-0 shadow-sm hover:shadow-md">
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </Card>
            )}

            {/* Reviews List */}
            <div>
              <div className="flex items-center gap-2 mb-lg">
                <Star className="text-primary size-5 fill-primary" />
                <h2 className="font-heading text-headline-md text-on-surface">
                  {avgRating || 'No rating'} {listing.reviews?.length > 0 && `· ${listing.reviews.length} review${listing.reviews.length !== 1 ? 's' : ''}`}
                </h2>
              </div>
              {!listing.reviews?.length ? (
                <Card className="p-8 text-center shadow-none border-outline-variant/30">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-on-surface-variant text-sm">No reviews yet.{canReview && ' Be the first!'}</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-xxl gap-y-lg">
                  {listing.reviews.map((review) => (
                    <div key={review._id} className="space-y-md">
                      <div className="flex items-center gap-md">
                        <Avatar size="default">
                          <AvatarFallback className="bg-linear-to-br from-secondary to-tertiary text-white font-semibold">
                            {review.author?.username?.[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-on-surface mb-0">{review.author?.username}</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`size-3 ${i < review.rating ? 'text-primary fill-primary' : 'text-on-surface-variant/30'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed">{review.comment}</p>
                      {user && user._id === review.author?._id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-xs text-destructive/70 hover:text-destructive transition-colors bg-transparent border-0 cursor-pointer p-0">
                              Delete review
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                              <AlertDialogDescription>This action can't be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteReview(review._id)} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky booking widget */}
          <div className="lg:col-span-1">
            <Card className="p-xl sticky top-28 shadow-lg border-outline-variant/30">
              <div className="flex justify-between items-end mb-lg">
                <div>
                  <span className="text-2xl font-bold text-on-surface">${listing.price.toLocaleString('en-US')}</span>
                  <span className="text-on-surface-variant font-normal"> / night</span>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="text-primary size-3.5 fill-primary" />
                    <span>{avgRating}</span>
                  </div>
                )}
              </div>

              <div className="border border-outline-variant rounded-lg overflow-hidden mb-lg">
                <div className="grid grid-cols-2 border-b border-outline-variant">
                  <div className="p-3 border-r border-outline-variant">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Check-in</label>
                    <div className="text-sm font-medium text-on-surface">Add date</div>
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Check-out</label>
                    <div className="text-sm font-medium text-on-surface">Add date</div>
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Guests</label>
                  <div className="text-sm font-medium text-on-surface">1 guest</div>
                </div>
              </div>

              {!user ? (
                <Button asChild size="lg" className="w-full rounded-lg bg-primary text-on-primary font-bold border-0 shadow-md">
                  <Link to="/user/login">Login to Book</Link>
                </Button>
              ) : isOwner ? (
                <Button asChild size="lg" className="w-full rounded-lg bg-primary text-on-primary font-bold border-0 shadow-md">
                  <Link to={`/listings/${listing._id}/edit`}>Edit Listing</Link>
                </Button>
              ) : (
                <Button size="lg" className="w-full rounded-lg bg-primary text-on-primary font-bold border-0 shadow-md">
                  Reserve
                </Button>
              )}
              <p className="text-center text-on-surface-variant text-sm mt-3 mb-0">You won't be charged yet</p>

              <div className="mt-lg flex items-center justify-center gap-2 text-on-surface-variant text-xs">
                <Flag className="size-3.5" />
                <span className="underline cursor-pointer">Report this listing</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
