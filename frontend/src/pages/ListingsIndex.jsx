import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import {
  Search, X, Info, Star, Award, Map as MapIcon, List, ChevronDown, SlidersHorizontal,
} from 'lucide-react';
import { listingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { AMENITIES } from '../lib/amenities';
import { loadEnglishStyle } from '../lib/mapStyle';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/animate-ui/components/radix/toggle-group';
import { LikeButton } from '../components/LikeButton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';

const CATEGORIES = [
  'Trending', 'Rooms', 'Iconic City', 'Mountains', 'Castles',
  'Amazing Pools', 'Camping', 'Farm', 'Arctic',
];

const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'most-reviewed', label: 'Most reviewed' },
];

const MIN_RATINGS = [
  { value: '', label: 'Any rating' },
  { value: '4.5', label: '4.5+' },
  { value: '4.8', label: '4.8+' },
];

const GUEST_FAVORITE_THRESHOLD = 4.8;
const PAGE_SIZE = 8;

const getAvgRating = (listing) => listing.reviews?.length
  ? listing.reviews.reduce((s, r) => s + (r.rating || 0), 0) / listing.reviews.length
  : null;

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const ListingsMap = ({ listings }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const clusterIndexRef = useRef(new Supercluster({ radius: 50, maxZoom: 14 }));
  const markersRef = useRef([]);
  const listingsRef = useRef(listings);
  const navigate = useNavigate();

  useEffect(() => { listingsRef.current = listings; }, [listings]);

  const rebuildIndex = () => {
    const withCoords = listingsRef.current.filter((l) => l.geometry?.coordinates);
    clusterIndexRef.current = new Supercluster({ radius: 50, maxZoom: 14 });
    clusterIndexRef.current.load(withCoords.map((listing) => ({
      type: 'Feature',
      properties: { listing },
      geometry: { type: 'Point', coordinates: listing.geometry.coordinates },
    })));
    return withCoords;
  };

  const renderMarkers = () => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const b = map.getBounds();
    const bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
    const zoom = Math.round(map.getZoom());
    const clusters = clusterIndexRef.current.getClusters(bbox, zoom);

    clusters.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const el = document.createElement('div');

      if (feature.properties.cluster) {
        const count = feature.properties.point_count;
        el.className = 'map-cluster-badge';
        el.textContent = count;
        el.addEventListener('click', () => {
          const expansionZoom = Math.min(
            clusterIndexRef.current.getClusterExpansionZoom(feature.properties.cluster_id),
            20
          );
          map.flyTo({ center: [lng, lat], zoom: expansionZoom, duration: 500 });
        });
        const marker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).addTo(map);
        markersRef.current.push(marker);
        return;
      }

      const listing = feature.properties.listing;
      el.className = 'map-price-pin';
      el.textContent = `$${listing.price.toLocaleString('en-US')}`;
      el.addEventListener('click', () => navigate(`/listings/${listing._id}`, { state: { fromMap: true } }));

      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14 })
        .setHTML(`<strong>${escapeHtml(listing.title)}</strong><br/>${escapeHtml(listing.location)}, ${escapeHtml(listing.country)}`);
      el.addEventListener('mouseenter', () => popup.setLngLat([lng, lat]).addTo(map));
      el.addEventListener('mouseleave', () => popup.remove());

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).addTo(map);
      markersRef.current.push(marker);
    });
  };

  const fitToListings = (withCoords) => {
    const map = mapRef.current;
    if (!map || !withCoords.length) return;
    if (withCoords.length > 1) {
      const bounds = withCoords.reduce(
        (b, l) => b.extend(l.geometry.coordinates),
        new maplibregl.LngLatBounds(withCoords[0].geometry.coordinates, withCoords[0].geometry.coordinates)
      );
      map.fitBounds(bounds, { padding: 60, maxZoom: 12 });
    } else {
      map.flyTo({ center: withCoords[0].geometry.coordinates, zoom: 11 });
    }
  };

  // Mount the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const style = await loadEnglishStyle();
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style,
        center: [78.9629, 20.5937],
        zoom: 4,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
      map.on('moveend', renderMarkers);
      mapRef.current = map;
      map.once('load', () => {
        const withCoords = rebuildIndex();
        fitToListings(withCoords);
        renderMarkers();
      });
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-index and re-frame whenever the filtered listing set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.loaded()) return; // initial mount's 'load' handler covers this case
    const withCoords = rebuildIndex();
    fitToListings(withCoords);
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export const ListingsIndex = () => {
  const [listings, setListings] = useState([]);
  const [liveQuery, setLiveQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [mapOpen, setMapOpen] = useState(() => searchParams.get('view') === 'map');
  const loadMoreRef = useRef(null);

  useEffect(() => { fetchListings(); }, []);
  useEffect(() => { setLiveQuery(searchQuery); }, [searchQuery]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await listingsAPI.getAllListings();
      setListings(response.data.allListings);
      setError('');
    } catch { setError('Failed to load listings'); }
    finally { setIsLoading(false); }
  };

  const filteredListings = useMemo(() => {
    let result = listings;

    if (liveQuery.trim()) {
      const q = liveQuery.toLowerCase();
      result = result.filter(l =>
        l.location?.toLowerCase().includes(q) || l.country?.toLowerCase().includes(q) || l.title?.toLowerCase().includes(q));
    }

    if (activeCategory) {
      const q = activeCategory.toLowerCase();
      result = result.filter(l =>
        l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.location?.toLowerCase().includes(q));
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(min)) result = result.filter(l => l.price >= min);
    if (!Number.isNaN(max)) result = result.filter(l => l.price <= max);

    if (minRating) {
      const threshold = parseFloat(minRating);
      result = result.filter(l => (getAvgRating(l) || 0) >= threshold);
    }

    if (selectedAmenities.length) {
      result = result.filter(l => selectedAmenities.every(a => l.amenities?.includes(a)));
    }

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating-desc') result = [...result].sort((a, b) => (getAvgRating(b) || 0) - (getAvgRating(a) || 0));
    if (sortBy === 'most-reviewed') result = [...result].sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));

    return result;
  }, [listings, liveQuery, activeCategory, minPrice, maxPrice, minRating, selectedAmenities, sortBy]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [liveQuery, activeCategory, minPrice, maxPrice, minRating, selectedAmenities, sortBy]);

  const hasMore = visibleCount < filteredListings.length;

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredListings.length));
        }
      },
      { rootMargin: '600px' }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, filteredListings.length]);

  const visibleListings = filteredListings.slice(0, visibleCount);
  const activeFilterCount = (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating ? 1 : 0) + selectedAmenities.length;

  const formatPrice = (p) => p.toLocaleString('en-US');
  const clearSearch = () => { setLiveQuery(''); setSearchParams({}); };
  const clearFilters = () => { setMinPrice(''); setMaxPrice(''); setMinRating(''); setSelectedAmenities([]); };
  const toggleAmenityFilter = (value) => {
    setSelectedAmenities(prev => prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]);
  };

  const handleCardClick = (e) => {
    if (!user) { e.preventDefault(); navigate('/user/login'); }
  };

  return (
    <div className="flex flex-col bg-surface min-h-screen">
      {/* Category filter bar */}
      <nav className="sticky top-20 z-30 bg-surface border-b border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div className="relative shrink-0 w-40 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-3.5" />
            <Input
              value={liveQuery}
              onChange={(e) => {
                const val = e.target.value;
                setLiveQuery(val);
                setSearchParams(val.trim() ? { search: val.trim() } : {});
              }}
              placeholder="Search stays..."
              className="h-9 rounded-full bg-surface-container-low border-outline-variant pl-9 pr-7 text-sm"
            />
            {liveQuery && (
              <button onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div className="w-px h-8 bg-outline-variant/60 shrink-0" />
          <ToggleGroup
            type="single"
            className="gap-1"
            value={activeCategory}
            onValueChange={(v) => setActiveCategory(v || '')}
          >
            {CATEGORIES.map((label) => (
              <ToggleGroupItem key={label} value={label} className="h-auto px-4 py-2 text-on-surface-variant data-[state=on]:text-on-surface whitespace-nowrap shrink-0 text-sm font-medium">
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="ml-auto flex items-center gap-3 shrink-0 pl-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 border border-outline-variant rounded-xl px-4 py-2 hover:bg-surface-container-low transition-colors text-label-md whitespace-nowrap">
                  <SlidersHorizontal className="size-4" />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-4 max-h-[70vh] overflow-y-auto">
                <p className="text-sm font-semibold text-on-surface mb-3">Price per night</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                    <Input type="number" min="0" placeholder="Min" value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)} className="h-9 rounded-lg pl-6 text-sm" />
                  </div>
                  <span className="text-on-surface-variant">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                    <Input type="number" min="0" placeholder="Max" value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)} className="h-9 rounded-lg pl-6 text-sm" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-on-surface mb-2">Minimum rating</p>
                <div className="flex gap-2 mb-1">
                  {MIN_RATINGS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setMinRating(r.value)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${minRating === r.value ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm font-semibold text-on-surface mb-2 mt-4">Amenities</p>
                <div className="flex flex-col gap-1.5 mb-1">
                  {AMENITIES.map(({ value, label, icon: Icon }) => {
                    const checked = selectedAmenities.includes(value);
                    return (
                      <label
                        key={value}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg border cursor-pointer transition-all text-xs ${checked ? 'border-primary bg-primary/10 text-on-surface' : 'border-outline-variant text-on-surface-variant hover:border-primary/50'}`}
                      >
                        <input type="checkbox" className="hidden" checked={checked} onChange={() => toggleAmenityFilter(value)} />
                        <Icon className="size-3.5 shrink-0" />
                        {label}
                      </label>
                    );
                  })}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-3 text-xs text-primary font-semibold hover:underline">
                    Clear filters
                  </button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-margin-mobile md:px-lg py-xl">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-xl">
          <div>
            <h1 className="font-heading text-headline-lg text-on-surface">
              {liveQuery ? `Stays in ${liveQuery}` : 'Explore unique stays'}
            </h1>
            <p className="text-on-surface-variant">
              {isLoading ? 'Loading stays…' : `Showing ${filteredListings.length} stay${filteredListings.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant hover:border-on-surface transition-all whitespace-nowrap">
                  <span className="text-label-md">Sort: <span className="font-bold">{SORTS.find(s => s.value === sortBy)?.label}</span></span>
                  <ChevronDown className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {SORTS.map((s) => (
                  <DropdownMenuItem key={s.value} onSelect={() => setSortBy(s.value)} className="cursor-pointer">
                    {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {user && (
              <Button asChild size="sm" className="rounded-full bg-primary text-on-primary font-bold shadow-sm border-0 whitespace-nowrap">
                <Link to="/listing/new">+ Add</Link>
              </Button>
            )}
          </div>
        </div>

        {liveQuery && (
          <button onClick={clearSearch} className="mb-lg flex items-center gap-1.5 text-body-sm text-on-surface-variant bg-surface-container-low border-0 cursor-pointer px-3 py-1.5 rounded-full hover:bg-surface-container transition-all">
            <Search className="size-3.5" /> Clear search <X className="size-3.5" />
          </button>
        )}

        {!user && (
          <div className="flex items-center gap-2.5 mb-xl px-4 py-3 bg-tertiary/10 border border-tertiary/30 rounded-2xl">
            <Info className="text-tertiary size-4 shrink-0" />
            <span className="text-body-sm text-on-surface">
              <Link to="/user/login" className="text-tertiary font-bold no-underline">Sign in</Link> to view full listing details and make reservations.
            </span>
          </div>
        )}

        {error && <div className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-2xl text-destructive text-sm mb-xl">{error}</div>}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-gutter gap-y-xl">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-4/3 w-full rounded-xl mb-3" />
                <Skeleton className="h-3.5 w-3/4 mb-2.5 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-on-surface mb-2">No stays found</h3>
            <p className="text-sm text-on-surface-variant mb-6">Try a different location, category, or price range</p>
            <Button onClick={() => { clearSearch(); setActiveCategory(''); clearFilters(); }} className="rounded-full bg-primary text-on-primary font-bold border-0">
              View all stays
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-gutter gap-y-xl">
              {visibleListings.map((listing) => {
                const avgRating = getAvgRating(listing);
                const isGuestFavorite = avgRating !== null && avgRating >= GUEST_FAVORITE_THRESHOLD;
                return (
                  <Link key={listing._id} to={`/listings/${listing._id}`} onClick={handleCardClick} className="group no-underline text-inherit block">
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-lg transition-shadow">
                      <img src={listing.image} alt={listing.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <LikeButton
                        listingId={listing._id}
                        className="absolute top-3 right-3 text-white drop-shadow-md hover:scale-110 transition-transform"
                        iconClassName="size-5"
                      />
                      {isGuestFavorite && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-lg text-xs font-bold text-on-surface shadow-sm">
                          <Award className="size-3 text-primary" /> Guest favorite
                        </div>
                      )}
                      {!user && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 group-hover:bg-black/10 group-hover:opacity-100 transition-opacity">
                          <div className="bg-surface-container-lowest px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface shadow-md">
                            Sign in to view
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-heading text-body-lg font-bold text-on-surface truncate">{listing.location}, {listing.country}</h3>
                        <p className="text-on-surface-variant text-body-sm mb-0 truncate">{listing.title}</p>
                        <p className="mt-2 text-on-surface font-bold text-body-md">
                          ${formatPrice(listing.price)} <span className="font-normal text-on-surface-variant">night</span>
                        </p>
                      </div>
                      {avgRating !== null && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="size-3.5 fill-primary text-primary" />
                          <span className="text-body-sm font-semibold">{avgRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="mt-16 flex items-center justify-center gap-2.5 text-on-surface-variant">
                <div className="w-4 h-4 border-2 border-surface-container-high border-t-primary rounded-full animate-spin" />
                <span className="text-label-md">Loading more stays…</span>
              </div>
            )}
          </>
        )}
      </main>

      {/* Full-screen map overlay */}
      {mapOpen && (
        <div className="fixed inset-x-0 bottom-0 top-20 z-40 bg-surface flex flex-col">
          <ListingsMap listings={filteredListings} />
        </div>
      )}

      {/* Map/list toggle FAB */}
      <button
        onClick={() => {
          const next = !mapOpen;
          setMapOpen(next);
          const params = new URLSearchParams(searchParams);
          if (next) params.set('view', 'map'); else params.delete('view');
          setSearchParams(params, { replace: true });
        }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 active:scale-95 transition-transform"
      >
        <span className="font-bold text-body-sm">{mapOpen ? 'Show list' : 'Show map'}</span>
        {mapOpen ? <List className="size-4" /> : <MapIcon className="size-4" />}
      </button>
    </div>
  );
};
