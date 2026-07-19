import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, Star, MapPin, Users, BedDouble, Bath, ShieldCheck,
  CalendarClock, LayoutGrid, Flag, Minus, Plus, CheckCircle2, Navigation, LocateFixed, Locate, Footprints, X,
} from 'lucide-react';
import { listingsAPI, reviewsAPI, bookingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { recordRecentlyViewed } from '../lib/recentlyViewed';
import { AMENITIES } from '../lib/amenities';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { loadEnglishStyle } from '../lib/mapStyle';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/animate-ui/components/buttons/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/animate-ui/components/radix/alert-dialog';
import { LikeButton } from '../components/LikeButton';
import { Modal } from '../components/Modal';
import { ReportListingModal } from '../components/ReportListingModal';
import { StreetView } from '../components/StreetView';

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN;

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const toDateInputValue = (d) => d.toISOString().slice(0, 10);
const EMPTY_ROUTE = { type: 'FeatureCollection', features: [] };

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'Great host', desc: 'Experienced hosts committed to providing great stays for guests.' },
  { icon: MapPin, title: 'Great location', desc: '100% of recent guests gave the location a 5-star rating.' },
  { icon: CalendarClock, title: 'Free cancellation for 48 hours', desc: 'Get a full refund if you change your mind within two days of booking.' },
];

export const ShowListing = () => {
  const { id } = useParams();
  const location = useLocation();
  const backToListingsPath = location.state?.fromMap ? '/listing?view=map' : '/listing';
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [reviewErrors, setReviewErrors] = useState({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locateError, setLocateError] = useState('');
  const [mapillaryImageId, setMapillaryImageId] = useState(null);
  const [streetViewOpen, setStreetViewOpen] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const listingCoordsRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => { fetchListing(); }, [id]);

  useEffect(() => {
    bookingsAPI.getBookedDates(id)
      .then((res) => setBookedRanges(res.data.bookedRanges || []))
      .catch(() => setBookedRanges([]));
  }, [id]);

  useEffect(() => {
    if (listing?.geometry && !mapInitialized) {
      // Small delay to ensure DOM element is rendered
      const t = setTimeout(() => initializeMap(), 100);
      return () => clearTimeout(t);
    }
  }, [listing, mapInitialized]);

  useEffect(() => {
    if (!MAPILLARY_TOKEN || !listing?.geometry?.coordinates) return;
    const [lng, lat] = listing.geometry.coordinates;
    let cancelled = false;

    const IMAGE_FIELDS = 'id,is_pano,compass_angle,computed_geometry';

    const findNearestStreetImage = async () => {
      try {
        // Precise point search first — the Mapillary API caps this at a 50m radius. Ask for
        // several candidates (not just the closest) so a facing-away shot right next to the
        // listing can lose out to a well-aimed or panoramic one a little further out.
        const near = await fetch(
          `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=${IMAGE_FIELDS}&lat=${lat}&lng=${lng}&radius=50&limit=10`
        ).then((r) => r.json());
        if (near.error) console.warn('Mapillary radius search failed:', near.error.message);
        if (near.data?.length) {
          const best = pickBestStreetImage(near.data, lat, lng);
          if (best && !cancelled) setMapillaryImageId(best.id);
          if (best) return;
        }

        // Fallback: widen the search box and score every candidate the same way.
        // Mapillary's bbox search errors out ("reduce the amount of data you're asking for")
        // based on image *density* within the box, not its geometric size — so a box that's
        // safe in most places can still fail in the most heavily-photographed historic
        // districts (tested: it choked in both Tokyo and Kyoto at different sizes). Try
        // progressively smaller boxes until one actually succeeds, instead of guessing one
        // fixed size and silently giving up if that guess was wrong for this particular spot.
        let wide = null;
        for (const delta of [0.002, 0.0015, 0.001, 0.0005]) {
          if (cancelled) return;
          const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
          const attempt = await fetch(
            `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=${IMAGE_FIELDS}&bbox=${bbox}&limit=20`
          ).then((r) => r.json());
          if (!attempt.error) { wide = attempt; break; }
          console.warn(`Mapillary bbox search failed at delta=${delta}:`, attempt.error.message);
        }
        if (!wide?.data?.length || cancelled) return;

        const best = pickBestStreetImage(wide.data, lat, lng);
        if (best) setMapillaryImageId(best.id);
      } catch (err) {
        console.warn('Mapillary lookup failed:', err.message);
      }
    };

    findNearestStreetImage();
    return () => { cancelled = true; };
  }, [listing?.geometry]);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      const response = await listingsAPI.getListingById(id);
      setListing(response.data.listing);
      recordRecentlyViewed(response.data.listing);
    } catch (err) {
      setError('Failed to load listing');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = async () => {
    const el = document.getElementById('map');
    if (!el) return;

    const [lng, lat] = listing.geometry.coordinates;
    const style = await loadEnglishStyle();
    if (!document.getElementById('map')) return; // unmounted while style was loading

    const map = new maplibregl.Map({
      container: el,
      style,
      center: [lng, lat],
      zoom: 14,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    mapRef.current = map;
    listingCoordsRef.current = [lng, lat];

    map.once('load', () => {
      map.addSource('route', { type: 'geojson', data: EMPTY_ROUTE });
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#ba0036',
          'line-width': 4,
          'line-opacity': 0.85,
          'line-dasharray': ['literal', [1, 0]],
        },
      });
    });

    const pinEl = document.createElement('div');
    pinEl.style.cssText = 'width:34px;height:34px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4));cursor:pointer;';
    pinEl.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#ba0036" stroke="#fff" stroke-width="1">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" fill="#fff" stroke="none" />
      </svg>
    `;
    pinEl.addEventListener('click', () => map.flyTo({ center: [lng, lat], zoom: 17, duration: 800 }));
    new maplibregl.Marker({ element: pinEl, anchor: 'bottom' }).setLngLat([lng, lat]).addTo(map);

    setMapInitialized(true);
  };

  const recenterMap = () => {
    if (!mapRef.current || !listingCoordsRef.current) return;
    mapRef.current.flyTo({ center: listingCoordsRef.current, zoom: 14, duration: 800 });
  };

  const haversineKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Compass bearing (0-360°) from point A looking toward point B.
  const bearingDeg = (lat1, lon1, lat2, lon2) => {
    const toRad = (d) => d * Math.PI / 180;
    const φ1 = toRad(lat1), φ2 = toRad(lat2);
    const Δλ = toRad(lon2 - lon1);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  const angleDiffDeg = (a, b) => {
    const diff = Math.abs(a - b) % 360;
    return diff > 180 ? 360 - diff : diff;
  };

  // Lower is better. Panoramas can be looked around in any direction once open, so they
  // almost always show "the place" regardless of which way the camera happened to face —
  // heavily prefer those. For a fixed-angle photo, distance alone isn't enough: a photo
  // 5m away but pointed the opposite direction from the listing is a worse pick than one
  // 20m away that's actually facing it, so penalize how far the camera's compass_angle is
  // from the bearing toward the listing.
  const scoreStreetImage = (img, targetLat, targetLng) => {
    const coords = img.computed_geometry?.coordinates;
    if (!coords) return Infinity;
    const [imgLng, imgLat] = coords;
    const distanceM = haversineKm(imgLat, imgLng, targetLat, targetLng) * 1000;
    if (img.is_pano) return distanceM;
    const bearingToTarget = bearingDeg(imgLat, imgLng, targetLat, targetLng);
    const facingPenalty = typeof img.compass_angle === 'number'
      ? angleDiffDeg(img.compass_angle, bearingToTarget) * 15
      : 1000; // unknown orientation — treat as a likely-bad angle, not a free pass
    return distanceM + facingPenalty + 3000; // flat handicap vs. any panorama
  };

  const pickBestStreetImage = (images, targetLat, targetLng) => images.reduce((best, img) => {
    const score = scoreStreetImage(img, targetLat, targetLng);
    return !best || score < best.score ? { id: img.id, score } : best;
  }, null);

  const placeUserMarker = (map, lngLat) => {
    userMarkerRef.current?.remove();
    const userEl = document.createElement('div');
    userEl.style.cssText = 'width:16px;height:16px;border-radius:50%;background:#4285F4;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);';
    userMarkerRef.current = new maplibregl.Marker({ element: userEl, anchor: 'center' }).setLngLat(lngLat).addTo(map);
    return userMarkerRef.current;
  };

  const drawRoute = (map, userLngLat, listingLngLat, coords, meta) => {
    placeUserMarker(map, userLngLat);

    const source = map.getSource('route');
    if (source) {
      source.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} });
      map.setPaintProperty('route', 'line-dasharray', meta.approx ? ['literal', [2, 2]] : ['literal', [1, 0]]);
    }

    const bounds = [userLngLat, listingLngLat, ...coords].reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds(userLngLat, userLngLat)
    );
    map.fitBounds(bounds, { padding: 40 });
    setRouteInfo(meta);
  };

  const handleGetDirections = () => {
    if (!navigator.geolocation) {
      setDirectionsError('Geolocation is not supported by your browser.');
      return;
    }
    setDirectionsLoading(true);
    setDirectionsError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const [listingLng, listingLat] = listingCoordsRef.current;
        const map = mapRef.current;

        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${listingLng},${listingLat}?overview=full&geometry=geojson`
          );
          const data = await res.json();
          const route = data.routes?.[0];
          if (!route) throw new Error('No route found');

          drawRoute(map, [userLng, userLat], [listingLng, listingLat], route.geometry.coordinates, {
            distanceKm: (route.distance / 1000).toFixed(1),
            durationMin: Math.round(route.duration / 60),
            approx: false,
          });
        } catch {
          // Fallback: straight line + as-the-crow-flies distance
          const km = haversineKm(userLat, userLng, listingLat, listingLng);
          drawRoute(map, [userLng, userLat], [listingLng, listingLat], [[userLng, userLat], [listingLng, listingLat]], {
            distanceKm: km.toFixed(1),
            durationMin: null,
            approx: true,
          });
        } finally {
          setDirectionsLoading(false);
        }
      },
      (err) => {
        setDirectionsLoading(false);
        setDirectionsError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access was denied. Enable it in your browser settings to get directions.'
            : "Couldn't get your location. Please try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClearDirections = () => {
    const map = mapRef.current;
    map?.getSource('route')?.setData(EMPTY_ROUTE);
    userMarkerRef.current?.remove();
    userMarkerRef.current = null;
    setRouteInfo(null);
    setDirectionsError('');
    recenterMap();
  };

  const handleShowMyLocation = () => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    setLocateError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLngLat = [pos.coords.longitude, pos.coords.latitude];
        const map = mapRef.current;
        if (map) {
          placeUserMarker(map, userLngLat);
          map.flyTo({ center: userLngLat, zoom: 15, duration: 800 });
        }
        setLocatingUser(false);
      },
      (err) => {
        setLocatingUser(false);
        setLocateError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access was denied. Enable it in your browser settings.'
            : "Couldn't get your location. Please try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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

  const datesOverlapBooked = (inDate, outDate) => bookedRanges.some((r) => {
    const rIn = new Date(r.checkIn);
    const rOut = new Date(r.checkOut);
    return inDate < rOut && outDate > rIn;
  });

  const handleReserve = async () => {
    setBookingError('');
    if (!checkIn || !checkOut) {
      setBookingError('Please select check-in and check-out dates.');
      return;
    }
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (outDate <= inDate) {
      setBookingError('Check-out must be after check-in.');
      return;
    }
    if (datesOverlapBooked(inDate, outDate)) {
      setBookingError('These dates are already booked. Try a different range.');
      return;
    }

    setIsBooking(true);
    try {
      const res = await bookingsAPI.createBooking(id, { checkIn, checkOut, guests: guestCount });
      setBookingConfirmed(res.data.booking);
      setBookedRanges((prev) => [...prev, { checkIn, checkOut }]);
      addToast('success', 'Booking confirmed!');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setIsBooking(false);
    }
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
        <Link to={backToListingsPath} className="mt-4 inline-block text-sm text-primary hover:underline">Back to listings</Link>
      </div>
    </div>
  );

  const isOwner = user && user._id === listing.owner?._id;
  const canReview = user && !isOwner;
  const avgRating = listing.reviews?.length
    ? (listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length).toFixed(1)
    : null;
  const gallery = [listing.image, ...(listing.images || [])].filter(Boolean);
  const sideImages = gallery.slice(1, 5);

  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut) - new Date(checkIn)) / MS_PER_DAY)
    : 0;
  const subtotal = nights > 0 ? nights * listing.price : 0;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-lg">
        {/* Title & basic info */}
        <div className="flex items-start justify-between gap-4 mb-lg">
          <div>
            <Link to={backToListingsPath} className="inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant no-underline mb-md hover:text-on-surface">
              <ArrowLeft className="size-3.5" /> Back to {location.state?.fromMap ? 'map' : 'listings'}
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

        {/* Image gallery */}
        <section className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-3 rounded-xl overflow-hidden mb-xxl h-70 md:h-105 relative">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="md:col-span-2 relative overflow-hidden group h-full border-0 p-0 cursor-pointer"
          >
            <img src={gallery[0]} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </button>
          {sideImages.length > 0 && (
            <div className="hidden md:flex md:flex-col gap-3 h-full">
              {sideImages.map((src, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setLightboxOpen(true)}
                  className="flex-1 relative overflow-hidden group border-0 p-0 cursor-pointer rounded-lg"
                >
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </button>
              ))}
            </div>
          )}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-md right-md bg-surface-container-lowest px-4 py-2 rounded-lg border border-on-surface text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-lg"
            >
              <LayoutGrid className="size-3.5" /> Show all photos
            </button>
          )}
        </section>

        <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)} title={`${listing.title} · ${gallery.length} photo${gallery.length !== 1 ? 's' : ''}`} maxWidthClass="max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt="" className="w-full h-64 object-cover rounded-xl" />
            ))}
          </div>
        </Modal>

        <ReportListingModal open={reportOpen} onClose={() => setReportOpen(false)} listingId={id} />

        <StreetView
          open={streetViewOpen}
          onClose={() => setStreetViewOpen(false)}
          imageId={mapillaryImageId}
          title={`Street View · ${listing.location}, ${listing.country}`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xxl">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Host */}
            <div className="flex justify-between items-start border-b border-outline-variant/30 pb-lg mb-lg">
              <div>
                <h2 className="font-heading text-headline-md text-on-surface mb-1">Hosted by {listing.owner?.username || 'Anonymous'}</h2>
                <p className="text-on-surface-variant text-body-sm flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><Users className="size-3.5" /> {listing.guests || 1} guest{(listing.guests || 1) !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1"><BedDouble className="size-3.5" /> {listing.bedrooms || 1} bedroom{(listing.bedrooms || 1) !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1"><Bath className="size-3.5" /> {listing.bathrooms || 1} bath{(listing.bathrooms || 1) !== 1 ? 's' : ''}</span>
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
            {listing.amenities?.length > 0 && (
              <div className="border-b border-outline-variant/30 pb-lg mb-lg">
                <h2 className="font-heading text-headline-md text-on-surface mb-lg">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {AMENITIES.filter((a) => listing.amenities.includes(a.value)).map((a) => (
                    <div key={a.value} className="flex items-center gap-md text-on-surface">
                      <a.icon className="size-5 text-on-surface-variant" />
                      <span>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {listing.geometry && (
              <div className="border-b border-outline-variant/30 pb-lg mb-lg">
                <div className="flex items-center justify-between flex-wrap gap-x-lg gap-y-2 mb-4">
                  <h2 className="font-heading text-headline-md text-on-surface mb-0">Where you'll be</h2>
                  <div className="flex items-center gap-lg flex-wrap">
                    {mapillaryImageId && (
                      <button
                        type="button"
                        onClick={() => setStreetViewOpen(true)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-primary bg-transparent border-0 cursor-pointer p-0"
                      >
                        <Footprints className="size-3.5" /> Street View
                      </button>
                    )}
                    {routeInfo ? (
                      <button
                        type="button"
                        onClick={handleClearDirections}
                        className="flex items-center gap-1.5 text-sm font-semibold text-destructive bg-transparent border-0 cursor-pointer p-0"
                      >
                        <X className="size-3.5" /> Clear directions
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGetDirections}
                        disabled={directionsLoading}
                        className="flex items-center gap-1.5 text-sm font-semibold text-primary bg-transparent border-0 cursor-pointer p-0 disabled:opacity-60"
                      >
                        <Navigation className="size-3.5" />
                        {directionsLoading ? 'Locating you...' : 'Get directions from my location'}
                      </button>
                    )}
                  </div>
                </div>

                {directionsError && (
                  <p className="text-destructive text-sm mb-3">{directionsError}</p>
                )}
                {locateError && (
                  <p className="text-destructive text-sm mb-3">{locateError}</p>
                )}
                {routeInfo && (
                  <p className="text-on-surface-variant text-sm mb-3">
                    {routeInfo.approx
                      ? `~${routeInfo.distanceKm} km away (straight-line — live routing was unavailable)`
                      : `${routeInfo.distanceKm} km · about ${routeInfo.durationMin} min by car`}
                  </p>
                )}

                <div className="relative">
                  <div id="map" className="rounded-xl overflow-hidden h-80" />
                  <div className="absolute top-3 right-3 z-1000 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleShowMyLocation}
                      disabled={locatingUser}
                      title="Show my location"
                      aria-label="Show my location"
                      className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant shadow-md flex items-center justify-center hover:bg-surface-container-low transition-colors disabled:opacity-60"
                    >
                      <Locate className={`size-4 text-on-surface ${locatingUser ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={recenterMap}
                      title="Recenter map"
                      aria-label="Recenter map"
                      className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant shadow-md flex items-center justify-center hover:bg-surface-container-low transition-colors"
                    >
                      <LocateFixed className="size-4 text-on-surface" />
                    </button>
                  </div>
                </div>
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

              {isOwner ? (
                <Button asChild size="lg" className="w-full rounded-lg bg-primary text-on-primary font-bold border-0 shadow-md">
                  <Link to={`/listings/${listing._id}/edit`}>Edit Listing</Link>
                </Button>
              ) : bookingConfirmed ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-lg text-center">
                  <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-on-surface mb-1">Booking confirmed!</p>
                  <p className="text-on-surface-variant text-sm mb-3">
                    {bookingConfirmed.nights} night{bookingConfirmed.nights !== 1 ? 's' : ''} · ${bookingConfirmed.totalPrice.toLocaleString('en-US')} total
                  </p>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/user/profile">View your trips</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="border border-outline-variant rounded-lg overflow-hidden mb-lg">
                    <div className="grid grid-cols-2 border-b border-outline-variant">
                      <div className="p-3 border-r border-outline-variant">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Check-in</label>
                        <input
                          type="date"
                          value={checkIn}
                          min={toDateInputValue(new Date())}
                          onChange={(e) => { setCheckIn(e.target.value); setBookingError(''); }}
                          className="text-sm font-medium text-on-surface bg-transparent border-0 p-0 w-full outline-none"
                        />
                      </div>
                      <div className="p-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Check-out</label>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn || toDateInputValue(new Date())}
                          onChange={(e) => { setCheckOut(e.target.value); setBookingError(''); }}
                          className="text-sm font-medium text-on-surface bg-transparent border-0 p-0 w-full outline-none"
                        />
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Guests</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                          disabled={guestCount <= 1}
                          className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center disabled:opacity-30"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="text-sm font-medium text-on-surface w-16 text-center">{guestCount} guest{guestCount !== 1 ? 's' : ''}</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.min(listing.guests || 1, g + 1))}
                          disabled={guestCount >= (listing.guests || 1)}
                          className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center disabled:opacity-30"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {nights > 0 && (
                    <div className="flex items-center justify-between text-sm text-on-surface-variant mb-lg">
                      <span>${listing.price.toLocaleString('en-US')} × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span className="font-semibold text-on-surface">${subtotal.toLocaleString('en-US')}</span>
                    </div>
                  )}

                  {bookingError && (
                    <p className="text-destructive text-sm mb-lg">{bookingError}</p>
                  )}

                  {!user ? (
                    <Button asChild size="lg" className="w-full rounded-lg bg-primary text-on-primary font-bold border-0 shadow-md">
                      <Link to="/user/login">Login to Book</Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleReserve}
                      disabled={isBooking}
                      className="w-full rounded-lg bg-primary text-on-primary font-bold border-0 shadow-md"
                    >
                      {isBooking ? 'Reserving...' : 'Reserve'}
                    </Button>
                  )}
                  <p className="text-center text-on-surface-variant text-sm mt-3 mb-0">You won't be charged yet</p>
                </>
              )}

              <div className="mt-lg flex items-center justify-center gap-2 text-on-surface-variant text-xs">
                <Flag className="size-3.5" />
                <button
                  type="button"
                  onClick={() => (user ? setReportOpen(true) : navigate('/user/login'))}
                  className="underline cursor-pointer bg-transparent border-0 p-0 text-on-surface-variant text-xs"
                >
                  Report this listing
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
