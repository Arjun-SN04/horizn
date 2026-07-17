import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2, AlertCircle, ShieldCheck, Check, BarChart3,
  CalendarDays, Bookmark, Heart,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { authAPI } from "../api";
import { LikeButton } from "../components/LikeButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from "@/components/animate-ui/components/radix/tabs";

const upcomingStays = [
  {
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    when: "IN 3 DAYS",
    location: "Rovaniemi, Finland",
    title: "Glass Forest Cabin",
    dates: "Dec 12 – Dec 17, 2024",
  },
  {
    img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80",
    when: "IN 6 WEEKS",
    location: "Marrakech, Morocco",
    title: "Authentic Oasis Riad",
    dates: "Jan 22 – Jan 28, 2025",
  },
];

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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/user/login");
      return;
    }
    fetchProfile();
  }, [user, authLoading, navigate]);

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
                  <div className="font-heading text-headline-md text-on-surface">24</div>
                  <div className="text-label-sm text-on-surface-variant uppercase tracking-wider">Reviews</div>
                </div>
                <div className="border-x border-outline-variant/30">
                  <div className="font-heading text-headline-md text-on-surface">5.0</div>
                  <div className="text-label-sm text-on-surface-variant uppercase tracking-wider">Rating</div>
                </div>
                <div>
                  <div className="font-heading text-headline-md text-on-surface">1</div>
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
            <div className="relative overflow-hidden bg-primary-container rounded-2xl p-xl text-on-primary-container shadow-lg border border-primary/20">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-lg gap-4">
                  <div>
                    <span className="bg-on-primary-container/10 px-md py-xs rounded-full text-label-sm inline-block mb-sm">HOST DASHBOARD</span>
                    <h2 className="font-heading text-headline-lg">Good morning, {formData.firstName || formData.username}</h2>
                    <p className="text-body-lg opacity-90">Your listings have 2 check-ins today.</p>
                  </div>
                  <div className="bg-white text-primary p-md rounded-full shadow-lg shrink-0">
                    <BarChart3 className="size-5" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-md border border-white/20">
                    <p className="text-label-sm opacity-80 uppercase">Pending Requests</p>
                    <p className="text-headline-md font-bold">3</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-md border border-white/20">
                    <p className="text-label-sm opacity-80 uppercase">Earnings this month</p>
                    <p className="text-headline-md font-bold">$4,280</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-md border border-white/20">
                    <p className="text-label-sm opacity-80 uppercase">Guest messages</p>
                    <p className="text-headline-md font-bold">5</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl" />
            </div>

            {/* Upcoming stays */}
            <div>
              <div className="flex justify-between items-center mb-lg">
                <h2 className="font-heading text-headline-md text-on-surface">Upcoming Stays</h2>
                <a className="text-primary text-label-md hover:underline cursor-pointer">View all (4)</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {upcomingStays.map((stay) => (
                  <div key={stay.title} className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img src={stay.img} alt={stay.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-md py-xs rounded-full text-label-sm font-bold shadow-sm text-on-surface">
                        {stay.when}
                      </div>
                    </div>
                    <div className="p-lg">
                      <div className="flex justify-between items-start mb-sm">
                        <div>
                          <p className="text-label-sm text-on-surface-variant uppercase">{stay.location}</p>
                          <h3 className="font-heading text-headline-md text-on-surface">{stay.title}</h3>
                        </div>
                        <div className="bg-surface-container-low p-sm rounded-lg shrink-0">
                          <CalendarDays className="text-primary size-4" />
                        </div>
                      </div>
                      <p className="text-body-sm text-on-surface-variant mb-lg">{stay.dates}</p>
                      <button className="w-full py-sm border border-outline-variant rounded-lg text-label-md hover:bg-surface transition-colors">Show Reservation</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wishlist — real favorited listings */}
            <div>
              <div className="flex justify-between items-center mb-lg">
                <h2 className="font-heading text-headline-md text-on-surface">Your Wishlist</h2>
                {favorites.length > 0 && (
                  <span className="text-label-md text-on-surface-variant">{favorites.length} saved</span>
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
                  {favorites.map((listing) => (
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
