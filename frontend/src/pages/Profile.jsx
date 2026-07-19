import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2, AlertCircle, ShieldCheck, Check, BarChart3,
  CalendarDays, Bookmark, Heart, Compass, X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";
import { authAPI, bookingsAPI, listingsAPI } from "../api";
import { LikeButton } from "../components/LikeButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from "@/components/animate-ui/components/radix/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/animate-ui/components/radix/alert-dialog";

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));

const whenLabel = (checkIn) => {
  const days = daysUntil(checkIn);
  if (days <= 0) return 'ONGOING';
  if (days === 1) return 'TOMORROW';
  if (days < 14) return `IN ${days} DAYS`;
  if (days < 60) return `IN ${Math.round(days / 7)} WEEKS`;
  return `IN ${Math.round(days / 30)} MONTHS`;
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { favorites } = useFavorites();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: ""
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [memberSince, setMemberSince] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/user/login");
      return;
    }
    fetchProfile();
    fetchTripsAndHostData();
  }, [user, authLoading, navigate]);

  const fetchTripsAndHostData = async () => {
    try {
      const [mineRes, hostingRes, listingsRes] = await Promise.all([
        bookingsAPI.getMyBookings(),
        bookingsAPI.getHostBookings(),
        listingsAPI.getAllListings({ owner: user._id }),
      ]);
      setMyBookings(mineRes.data.bookings || []);
      setHostBookings(hostingRes.data.bookings || []);
      setMyListings(listingsRes.data.allListings || []);
    } catch {
      // non-critical — profile still usable without trip/host data
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await bookingsAPI.cancelBooking(bookingId);
      setMyBookings((prev) => prev.filter((b) => b._id !== bookingId));
      addToast('success', 'Booking cancelled');
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setFormData({
          username: response.data.user.username || "",
          email: response.data.user.email || "",
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
          city: response.data.user.city || "",
          country: response.data.user.country || ""
        });
        setMemberSince(response.data.user.createdAt || null);
      }
    } catch (error) {
      setFlash({ type: "error", message: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPersonal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        setFlash({ type: "success", message: "Profile updated successfully!" });
        setTimeout(() => setFlash(null), 3000);
      }
    } catch (error) {
      setFlash({ type: "error", message: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setFlash({ type: "error", message: "New passwords do not match" });
        setSaving(false);
        return;
      }
      if (passwordData.newPassword.length < 6) {
        setFlash({ type: "error", message: "Password must be at least 6 characters long" });
        setSaving(false);
        return;
      }
      const response = await authAPI.changePassword(passwordData);
      if (response.data.success) {
        setFlash({ type: "success", message: "Password changed successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setFlash(null), 3000);
      }
    } catch (error) {
      setFlash({ type: "error", message: error.response?.data?.message || "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || formData.username;

  const isHost = myListings.length > 0;
  const allReviews = myListings.flatMap((l) => l.reviews || []);
  const avgHostRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : null;
  const yearsSinceJoin = memberSince ? (Date.now() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24 * 365) : null;
  const yearsLabel = yearsSinceJoin === null ? '—' : yearsSinceJoin < 1 ? 'New' : Math.floor(yearsSinceJoin);

  const today = new Date();
  const upcomingTrips = myBookings
    .filter((b) => b.status === 'confirmed' && new Date(b.checkOut) >= today)
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

  const upcomingCheckIns = hostBookings.filter((b) => new Date(b.checkIn) >= today).length;
  const earningsThisMonth = hostBookings
    .filter((b) => {
      const ci = new Date(b.checkIn);
      return ci.getMonth() === today.getMonth() && ci.getFullYear() === today.getFullYear();
    })
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-lg py-xl">
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`flex items-center gap-3 px-4 py-3 mb-lg rounded-xl border ${flash.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                {flash.type === 'success' ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
                <span className="text-sm font-medium">{flash.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-xxl">
          {/* Sidebar: profile summary */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-lg lg:sticky lg:top-24 lg:self-start">
            <Card className="p-xl shadow-sm items-center text-center gap-0">
              <Avatar className="size-32 mb-lg">
                <AvatarFallback className="bg-primary text-on-primary text-3xl font-bold">
                  {displayName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-heading text-headline-lg text-on-surface mb-xs">{displayName}</h1>
              <p className="text-body-sm text-on-surface-variant mb-lg">Member of Horizn</p>

              <div className="grid grid-cols-3 w-full border-y border-outline-variant/30 py-lg mb-lg">
                <div>
                  <div className="font-heading text-headline-md text-on-surface">{allReviews.length}</div>
                  <div className="text-label-sm text-on-surface-variant uppercase tracking-wider">Reviews</div>
                </div>
                <div className="border-x border-outline-variant/30">
                  <div className="font-heading text-headline-md text-on-surface">{avgHostRating || '—'}</div>
                  <div className="text-label-sm text-on-surface-variant uppercase tracking-wider">Rating</div>
                </div>
                <div>
                  <div className="font-heading text-headline-md text-on-surface">{yearsLabel}</div>
                  <div className="text-label-sm text-on-surface-variant uppercase tracking-wider">Years</div>
                </div>
              </div>

              <Button
                className="w-full rounded-lg bg-primary text-on-primary font-semibold border-0 shadow-sm"
                onClick={() => document.getElementById('account-settings')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Edit Profile
              </Button>
            </Card>

            <Card className="p-xl shadow-sm">
              <h2 className="font-heading text-headline-md text-on-surface mb-md">{formData.firstName || displayName}'s confirmed info</h2>
              <ul className="space-y-md">
                <li className="flex items-center gap-md text-on-surface-variant">
                  <Check className="text-primary size-4 shrink-0" />
                  <span>Email address</span>
                </li>
                <li className="flex items-center gap-md text-on-surface-variant">
                  <Check className="text-primary size-4 shrink-0" />
                  <span>Identity verified</span>
                </li>
                <li className="flex items-center gap-md text-on-surface-variant">
                  <Check className="text-primary size-4 shrink-0" />
                  <span>Phone number</span>
                </li>
              </ul>
              <hr className="my-lg border-outline-variant/30" />
              <p className="text-body-sm text-on-surface-variant mb-0">Verifying your identity helps keep our community safe for everyone.</p>
            </Card>
          </aside>

          {/* Main content */}
          <section className="flex-1 flex flex-col gap-xxl">
            {/* Host dashboard banner */}
            {isHost ? (
              <div className="relative overflow-hidden bg-primary-container rounded-2xl p-xl text-on-primary-container shadow-lg border border-primary/20">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-lg gap-4">
                    <div>
                      <span className="bg-on-primary-container/10 px-md py-xs rounded-full text-label-sm inline-block mb-sm">HOST DASHBOARD</span>
                      <h2 className="font-heading text-headline-lg">Good morning, {formData.firstName || formData.username}</h2>
                      <p className="text-body-lg opacity-90">
                        {upcomingCheckIns > 0
                          ? `You have ${upcomingCheckIns} upcoming check-in${upcomingCheckIns !== 1 ? 's' : ''}.`
                          : 'No upcoming check-ins right now.'}
                      </p>
                    </div>
                    <Link to="/listing/mine" className="bg-white text-primary p-md rounded-full shadow-lg shrink-0 hover:scale-105 transition-transform">
                      <BarChart3 className="size-5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-md border border-white/20">
                      <p className="text-label-sm opacity-80 uppercase">Upcoming check-ins</p>
                      <p className="text-headline-md font-bold">{upcomingCheckIns}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-md border border-white/20">
                      <p className="text-label-sm opacity-80 uppercase">Earnings this month</p>
                      <p className="text-headline-md font-bold">${earningsThisMonth.toLocaleString('en-US')}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-md border border-white/20">
                      <p className="text-label-sm opacity-80 uppercase">Total bookings</p>
                      <p className="text-headline-md font-bold">{hostBookings.length}</p>
                    </div>
                  </div>
                  <Link to="/listing/mine" className="inline-block mt-lg text-label-md font-semibold text-on-primary-container underline">
                    Manage your listings
                  </Link>
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl" />
              </div>
            ) : (
              <div className="relative overflow-hidden bg-surface-container-low rounded-2xl p-xl border border-outline-variant/30 flex items-center justify-between gap-lg flex-wrap">
                <div>
                  <h2 className="font-heading text-headline-md text-on-surface mb-1">Become a host</h2>
                  <p className="text-on-surface-variant text-body-sm mb-0">Share your space and start earning by welcoming travelers.</p>
                </div>
                <Button asChild className="rounded-full bg-primary text-on-primary font-bold border-0 shadow-sm shrink-0">
                  <Link to="/listing/new"><Compass className="size-4" /> Add a listing</Link>
                </Button>
              </div>
            )}

            {/* Upcoming stays */}
            <div>
              <div className="flex justify-between items-center mb-lg">
                <h2 className="font-heading text-headline-md text-on-surface">Upcoming Stays</h2>
                {upcomingTrips.length > 0 && (
                  <span className="text-label-md text-on-surface-variant">{upcomingTrips.length} upcoming</span>
                )}
              </div>
              {upcomingTrips.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-md py-16 bg-surface-container-lowest">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <CalendarDays className="size-5" />
                  </div>
                  <p className="text-on-surface-variant text-body-sm mb-0">No upcoming stays booked yet.</p>
                  <Link to="/listing" className="text-primary text-label-md font-semibold no-underline hover:underline">Explore stays</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {upcomingTrips.map((trip) => (
                    <div key={trip._id} className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300">
                      <Link to={`/listings/${trip.listing._id}`} className="block h-48 overflow-hidden relative no-underline">
                        <img src={trip.listing.image} alt={trip.listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-md py-xs rounded-full text-label-sm font-bold shadow-sm text-black">
                          {whenLabel(trip.checkIn)}
                        </div>
                      </Link>
                      <div className="p-lg">
                        <div className="flex justify-between items-start mb-sm">
                          <div>
                            <p className="text-label-sm text-on-surface-variant uppercase">{trip.listing.location}, {trip.listing.country}</p>
                            <h3 className="font-heading text-headline-md text-on-surface">{trip.listing.title}</h3>
                          </div>
                          <div className="bg-surface-container-low p-sm rounded-lg shrink-0">
                            <CalendarDays className="text-primary size-4" />
                          </div>
                        </div>
                        <p className="text-body-sm text-on-surface-variant mb-lg">
                          {formatDate(trip.checkIn)} – {formatDate(trip.checkOut)} · {trip.guests} guest{trip.guests !== 1 ? 's' : ''} · ${trip.totalPrice.toLocaleString('en-US')}
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              disabled={cancellingId === trip._id}
                              className="w-full py-sm border border-outline-variant rounded-lg text-label-md hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive transition-colors flex items-center justify-center gap-1.5"
                            >
                              <X className="size-3.5" /> {cancellingId === trip._id ? 'Cancelling...' : 'Cancel reservation'}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel this reservation?</AlertDialogTitle>
                              <AlertDialogDescription>This will cancel your stay at "{trip.listing.title}". This action can't be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep reservation</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelBooking(trip._id)} className="bg-destructive text-white hover:bg-destructive/90">Cancel stay</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist — preview of favorited listings */}
            <div>
              <div className="flex justify-between items-center mb-lg">
                <h2 className="font-heading text-headline-md text-on-surface">Your Wishlist</h2>
                {favorites.length > 0 && (
                  <Link to="/wishlist" className="text-primary text-label-md font-semibold hover:underline no-underline">
                    View all ({favorites.length})
                  </Link>
                )}
              </div>
              {favorites.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-md py-16 bg-surface-container-lowest">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <Bookmark className="size-5" />
                  </div>
                  <p className="text-on-surface-variant text-body-sm mb-0">Tap the <Heart className="inline size-3.5 -mt-0.5" /> on any stay to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                  {favorites.slice(0, 3).map((listing) => (
                    <Link key={listing._id} to={`/listings/${listing._id}`} className="group relative h-64 rounded-2xl overflow-hidden shadow-sm block no-underline">
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent z-10" />
                      <img src={listing.image} alt={listing.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <LikeButton
                        listingId={listing._id}
                        className="absolute top-3 right-3 z-20 glass-effect w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        iconClassName="text-white size-4"
                      />
                      <div className="absolute bottom-4 left-4 z-20 text-white">
                        <h3 className="font-heading text-headline-md">{listing.location}, {listing.country}</h3>
                        <p className="text-body-sm opacity-80 mb-0">${listing.price.toLocaleString('en-US')} / night</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Real account settings */}
            <div id="account-settings" className="scroll-mt-24">
              <h2 className="font-heading text-headline-md text-on-surface mb-lg">Account Settings</h2>
              <Tabs defaultValue="personal">
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>

                <TabsContents>
                  <TabsContent value="personal">
                    <Card className="p-8 shadow-sm">
                      <form onSubmit={handleSubmitPersonal} className="flex flex-col gap-6">
                        <div>
                          <Label className="mb-2">Username</Label>
                          <Input type="text" name="username" value={formData.username} onChange={handleChange}
                            placeholder="Enter username" className="h-11 rounded-xl bg-surface-container-low" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2">First Name</Label>
                            <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                              placeholder="Enter first name" className="h-11 rounded-xl bg-surface-container-low" />
                          </div>
                          <div>
                            <Label className="mb-2">Last Name</Label>
                            <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                              placeholder="Enter last name" className="h-11 rounded-xl bg-surface-container-low" />
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2">Email Address</Label>
                          <Input type="email" name="email" value={formData.email} onChange={handleChange}
                            placeholder="Enter email" className="h-11 rounded-xl bg-surface-container-low" required />
                        </div>

                        <div>
                          <Label className="mb-2">Phone Number</Label>
                          <Input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            placeholder="Enter phone number" className="h-11 rounded-xl bg-surface-container-low" />
                        </div>

                        <div>
                          <Label className="mb-2">Address</Label>
                          <Input type="text" name="address" value={formData.address} onChange={handleChange}
                            placeholder="Enter street address" className="h-11 rounded-xl bg-surface-container-low" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2">City</Label>
                            <Input type="text" name="city" value={formData.city} onChange={handleChange}
                              placeholder="Enter city" className="h-11 rounded-xl bg-surface-container-low" />
                          </div>
                          <div>
                            <Label className="mb-2">Country</Label>
                            <Input type="text" name="country" value={formData.country} onChange={handleChange}
                              placeholder="Enter country" className="h-11 rounded-xl bg-surface-container-low" />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-outline-variant/30">
                          <Button type="button" variant="outline" size="lg" className="flex-1 rounded-xl font-semibold" onClick={() => navigate(-1)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={saving} size="lg" className="flex-1 rounded-full bg-primary text-on-primary font-bold border-0 shadow-md hover:shadow-lg">
                            {saving ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </TabsContent>

                  <TabsContent value="password">
                    <Card className="p-8 shadow-sm">
                      <form onSubmit={handleSubmitPassword} className="flex flex-col gap-6">
                        <div className="flex items-start gap-2.5 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                          <ShieldCheck className="text-secondary size-4 shrink-0 mt-0.5" />
                          <p className="text-sm text-on-surface mb-0">
                            <span className="font-semibold">Security:</span> To change your password, you'll need to verify with your current password.
                          </p>
                        </div>

                        <div>
                          <Label className="mb-2">Current Password</Label>
                          <Input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange}
                            placeholder="Enter your current password" className="h-11 rounded-xl bg-surface-container-low" required />
                        </div>

                        <div>
                          <Label className="mb-2">New Password</Label>
                          <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                            placeholder="Enter new password (min 6 characters)" className="h-11 rounded-xl bg-surface-container-low" required />
                          <p className="text-xs text-on-surface-variant mt-1">Must be at least 6 characters long</p>
                        </div>

                        <div>
                          <Label className="mb-2">Confirm Password</Label>
                          <Input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                            placeholder="Confirm your new password" className="h-11 rounded-xl bg-surface-container-low" required />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-outline-variant/30">
                          <Button type="button" variant="outline" size="lg" className="flex-1 rounded-xl font-semibold"
                            onClick={() => setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })}>
                            Clear
                          </Button>
                          <Button type="submit" disabled={saving} size="lg" className="flex-1 rounded-full bg-primary text-on-primary font-bold border-0 shadow-md hover:shadow-lg">
                            {saving ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </TabsContent>
                </TabsContents>
              </Tabs>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
