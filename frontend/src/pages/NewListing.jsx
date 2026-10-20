import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, UploadCloud, X, PenLine, Images, MapPin, Users, ConciergeBell, Minus, Plus,
  Check, ImagePlus, BedDouble, Bath, Lightbulb, Loader2, Star,
} from 'lucide-react';
import { listingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { AMENITIES } from '../lib/amenities';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MAX_GALLERY = 6;
const DESC_LIMIT = 1000;

const fieldClass = 'h-11 rounded-xl bg-surface border-outline-variant/70 focus-visible:border-primary';

// ── building blocks ───────────────────────────────────────────────────

const Section = ({ id, step, icon: Icon, title, subtitle, children }) => (
  <section id={id} className="scroll-mt-28 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
    <header className="flex items-start gap-4 px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-outline-variant/30">
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="size-4.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Step {step}</p>
        <h2 className="font-heading text-lg font-bold text-on-surface mb-0.5 leading-tight">{title}</h2>
        <p className="text-sm text-on-surface-variant mb-0">{subtitle}</p>
      </div>
    </header>
    <div className="px-6 md:px-8 py-6 md:py-7">{children}</div>
  </section>
);

const Field = ({ label, required, hint, error, children, aside }) => (
  <div>
    <div className="flex items-baseline justify-between gap-2 mb-1.5">
      <Label className="text-sm font-semibold text-on-surface">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {aside}
    </div>
    {children}
    {error ? (
      <p className="text-xs text-destructive mt-1.5 mb-0">{error}</p>
    ) : hint ? (
      <p className="text-xs text-on-surface-variant mt-1.5 mb-0">{hint}</p>
    ) : null}
  </div>
);

const Stepper = ({ icon: Icon, label, value, onChange, min, step = 1, error }) => {
  const num = Number(value) || 0;
  const set = (n) => onChange(String(Math.max(min, Math.round(n * 2) / 2)));
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 ${error ? 'border-destructive/50' : 'border-outline-variant/60'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="size-5 text-on-surface-variant shrink-0" />
        <span className="text-sm font-semibold text-on-surface">{label}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button type="button" onClick={() => set(num - step)} disabled={num <= min} aria-label={`Fewer ${label}`}
          className="size-8 rounded-full border border-outline-variant bg-transparent flex items-center justify-center cursor-pointer text-on-surface hover:border-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Minus className="size-3.5" />
        </button>
        <span className="w-8 text-center font-semibold tabular-nums text-on-surface">{num}</span>
        <button type="button" onClick={() => set(num + step)} aria-label={`More ${label}`}
          className="size-8 rounded-full border border-outline-variant bg-transparent flex items-center justify-center cursor-pointer text-on-surface hover:border-on-surface transition-colors">
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── page ──────────────────────────────────────────────────────────────

export const NewListing = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', country: '', price: '',
    guests: '1', bedrooms: '1', bathrooms: '1',
  });
  const [amenities, setAmenities] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/user/login');
  }, [user, authLoading, navigate]);

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required.';
    if (!formData.description.trim()) e.description = 'Description is required.';
    if (!formData.location.trim()) e.location = 'Location is required.';
    if (!formData.country.trim()) e.country = 'Country is required.';
    if (!formData.price || formData.price <= 0) e.price = 'Valid price is required.';
    if (!formData.guests || formData.guests < 1) e.guests = 'Must allow at least 1 guest.';
    if (!formData.bedrooms || formData.bedrooms < 1) e.bedrooms = 'Must have at least 1 bedroom.';
    if (!formData.bathrooms || formData.bathrooms < 0.5) e.bathrooms = 'Must have at least 0.5 bathrooms.';
    if (!image) e.image = 'A cover photo is required.';
    setErrors(e);
    if (Object.keys(e).length) {
      // Jump to the first section with a problem
      const order = ['title', 'description', 'image', 'location', 'country', 'price', 'guests', 'bedrooms', 'bathrooms'];
      const first = order.find((k) => e[k]);
      const section = { title: 'basics', description: 'basics', image: 'photos', location: 'location', country: 'location', price: 'location' }[first] || 'capacity';
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return Object.keys(e).length === 0;
  };

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e) => setField(e.target.name, e.target.value);

  const toggleAmenity = (value) => {
    setAmenities(prev => prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]);
  };

  const setCover = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleImageChange = (e) => { setCover(e.target.files[0]); e.target.value = ''; };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setCover(e.dataTransfer.files[0]);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_GALLERY - galleryImages.length);
    setGalleryImages(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('lististing[title]', formData.title);
      data.append('lististing[description]', formData.description);
      data.append('lististing[location]', formData.location);
      data.append('lististing[country]', formData.country);
      data.append('lististing[price]', formData.price);
      data.append('lististing[guests]', formData.guests);
      data.append('lististing[bedrooms]', formData.bedrooms);
      data.append('lististing[bathrooms]', formData.bathrooms);
      data.append('lististing[amenities]', JSON.stringify(amenities));
      data.append('lististing[image]', image);
      galleryImages.forEach((file) => data.append('lististing[images]', file));
      await listingsAPI.createListing(data);
      navigate('/listing');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to create listing' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress checklist for the sidebar
  const checklist = [
    { id: 'basics',   label: 'Title & description', done: !!formData.title.trim() && !!formData.description.trim() },
    { id: 'photos',   label: 'Cover photo',         done: !!image },
    { id: 'location', label: 'Location & price',    done: !!formData.location.trim() && !!formData.country.trim() && Number(formData.price) > 0 },
    { id: 'capacity', label: 'Guests & rooms',      done: formData.guests >= 1 && formData.bedrooms >= 1 && formData.bathrooms >= 0.5 },
    { id: 'amenities', label: 'Amenities',          done: amenities.length > 0, optional: true },
  ];
  const required = checklist.filter((c) => !c.optional);
  const doneCount = required.filter((c) => c.done).length;
  const progress = Math.round((doneCount / required.length) * 100);
  const price = Number(formData.price) || 0;

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-[1880px] mx-auto px-6 md:px-10 xl:px-12 pt-8 pb-28 lg:pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link to="/listing" className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant no-underline mb-4 hover:text-on-surface transition-colors">
            <ArrowLeft className="size-4" /> Back to listings
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Become a host</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-1.5">Create a new listing</h1>
          <p className="text-on-surface-variant text-sm mb-0">Fill in the details below. You can preview how guests will see your place on the right.</p>
        </div>

        {errors.submit && (
          <div className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm mb-6">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start">
          {/* ── Left: form ── */}
          <div className="flex flex-col gap-6 min-w-0">
            <Section id="basics" step={1} icon={PenLine} title="The basics" subtitle="A clear title and description help guests decide.">
              <div className="flex flex-col gap-5">
                <Field label="Title" required error={errors.title}
                  aside={<span className="text-xs text-on-surface-variant tabular-nums">{formData.title.length}/80</span>}>
                  <Input name="title" value={formData.title} onChange={handleChange} maxLength={80}
                    placeholder="e.g. Sunlit loft with skyline views" className={fieldClass} aria-invalid={!!errors.title} />
                </Field>
                <Field label="Description" required error={errors.description}
                  hint="Mention the space, the neighbourhood and anything that makes a stay memorable."
                  aside={<span className="text-xs text-on-surface-variant tabular-nums">{formData.description.length}/{DESC_LIMIT}</span>}>
                  <Textarea name="description" rows={6} value={formData.description} onChange={handleChange} maxLength={DESC_LIMIT}
                    placeholder="Describe what makes your place special..."
                    className="rounded-xl bg-surface border-outline-variant/70 resize-y min-h-36 focus-visible:border-primary"
                    aria-invalid={!!errors.description} />
                </Field>
              </div>
            </Section>

            <Section id="photos" step={2} icon={Images} title="Photos" subtitle="Bright, wide shots get the most bookings.">
              <div className="flex flex-col gap-6">
                <Field label="Cover photo" required error={errors.image} hint={!preview ? 'JPG or PNG. This is the first photo guests see.' : null}>
                  {preview ? (
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-container group">
                      <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-surface-container-lowest/95 text-xs font-bold text-on-surface shadow-sm">Cover</span>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <label className="h-8 px-3 rounded-full bg-surface-container-lowest/95 text-xs font-semibold text-on-surface shadow-sm cursor-pointer inline-flex items-center gap-1.5 hover:bg-surface-container-lowest">
                          <ImagePlus className="size-3.5" /> Replace
                          <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <button type="button" onClick={() => { setPreview(null); setImage(null); }} aria-label="Remove cover photo"
                          className="size-8 rounded-full bg-surface-container-lowest/95 border-0 cursor-pointer text-on-surface shadow-sm flex items-center justify-center hover:bg-surface-container-lowest">
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center gap-3 w-full aspect-video max-h-80 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                        errors.image ? 'border-destructive/50 bg-destructive/5'
                          : isDragging ? 'border-primary bg-primary/5'
                          : 'border-outline-variant bg-surface hover:border-primary hover:bg-primary/5'}`}
                    >
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UploadCloud className="size-5 text-primary" />
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm font-semibold text-on-surface mb-0.5">Drag a photo here or <span className="text-primary underline underline-offset-2">browse</span></p>
                        <p className="text-xs text-on-surface-variant mb-0">Landscape photos look best</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  )}
                </Field>

                <Field label="Gallery" hint="Optional. Show off bedrooms, bathrooms and the view."
                  aside={<span className="text-xs text-on-surface-variant tabular-nums">{galleryImages.length}/{MAX_GALLERY}</span>}>
                  <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 gap-3">
                    {galleryPreviews.map((src, i) => (
                      <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(i)} aria-label="Remove photo"
                          className="absolute top-1.5 right-1.5 size-6 rounded-full bg-surface-container-lowest/95 border-0 cursor-pointer text-on-surface shadow-sm flex items-center justify-center">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                    {galleryImages.length < MAX_GALLERY && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-outline-variant bg-surface flex flex-col items-center justify-center gap-1.5 cursor-pointer text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                        <Plus className="size-5" />
                        <span className="text-xs font-semibold">Add</span>
                        <input type="file" className="hidden" onChange={handleGalleryChange} accept="image/*" multiple />
                      </label>
                    )}
                  </div>
                </Field>
              </div>
            </Section>

            <Section id="location" step={3} icon={MapPin} title="Location & pricing" subtitle="Where guests will stay, and what it costs per night.">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="City / area" required error={errors.location}>
                    <Input name="location" value={formData.location} onChange={handleChange}
                      placeholder="e.g. Goa" className={fieldClass} aria-invalid={!!errors.location} />
                  </Field>
                  <Field label="Country" required error={errors.country}>
                    <Input name="country" value={formData.country} onChange={handleChange}
                      placeholder="e.g. India" className={fieldClass} aria-invalid={!!errors.country} />
                  </Field>
                </div>
                <Field label="Price per night" required error={errors.price}
                  hint={price > 0 ? `A 5-night stay would cost guests $${(price * 5).toLocaleString('en-US')}.` : 'Set a nightly rate in USD.'}>
                  <div className="relative w-full sm:max-w-80">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">$</span>
                    <Input name="price" type="number" min="1" value={formData.price} onChange={handleChange}
                      placeholder="1200" className={`${fieldClass} pl-8 pr-20 font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`} aria-invalid={!!errors.price} />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant whitespace-nowrap">/ night</span>
                  </div>
                </Field>
              </div>
            </Section>

            <Section id="capacity" step={4} icon={Users} title="Guests & rooms" subtitle="How many people your place comfortably fits.">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Stepper icon={Users} label="Guests" value={formData.guests} min={1}
                  onChange={(v) => setField('guests', v)} error={errors.guests} />
                <Stepper icon={BedDouble} label="Bedrooms" value={formData.bedrooms} min={1}
                  onChange={(v) => setField('bedrooms', v)} error={errors.bedrooms} />
                <Stepper icon={Bath} label="Bathrooms" value={formData.bathrooms} min={0.5} step={0.5}
                  onChange={(v) => setField('bathrooms', v)} error={errors.bathrooms} />
              </div>
            </Section>

            <Section id="amenities" step={5} icon={ConciergeBell} title="Amenities" subtitle="Select everything your place offers.">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {AMENITIES.map(({ value, label, icon: Icon }) => {
                  const checked = amenities.includes(value);
                  return (
                    <label key={value}
                      className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all text-sm select-none ${
                        checked ? 'border-on-surface bg-surface-container-low ring-1 ring-on-surface' : 'border-outline-variant/60 hover:border-on-surface/50'}`}>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleAmenity(value)} />
                      <Icon className={`size-6 ${checked ? 'text-primary' : 'text-on-surface-variant'}`} />
                      <span className="font-semibold text-on-surface leading-snug">{label}</span>
                      {checked && (
                        <span className="absolute top-3 right-3 size-5 rounded-full bg-on-surface text-surface flex items-center justify-center">
                          <Check className="size-3" />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* ── Right: sticky sidebar ── */}
          <aside className="lg:sticky lg:top-28 flex flex-col gap-5">
            {/* Live preview */}
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Live preview</p>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-surface-container mb-3">
                {preview ? (
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                    <Images className="size-7 opacity-50" />
                    <span className="text-xs">Your cover photo</span>
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface shadow-sm">New</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-heading text-[15px] font-semibold text-on-surface truncate mb-0.5">
                    {[formData.location, formData.country].filter(Boolean).join(', ') || 'Location'}
                  </p>
                  <p className="text-sm text-on-surface-variant truncate mb-0.5">{formData.title || 'Your listing title'}</p>
                  <p className="text-xs text-on-surface-variant mb-1.5">
                    {formData.guests} guest{formData.guests != 1 ? 's' : ''} · {formData.bedrooms} bedroom{formData.bedrooms != 1 ? 's' : ''} · {formData.bathrooms} bath{formData.bathrooms != 1 ? 's' : ''}
                  </p>
                  <p className="text-sm mb-0 text-on-surface">
                    {price ? <><span className="font-semibold">${price.toLocaleString('en-US')}</span> night</> : <span className="text-on-surface-variant">Price per night</span>}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm shrink-0 text-on-surface-variant">
                  <Star className="size-3.5" /> New
                </span>
              </div>
            </div>

            {/* Progress + submit */}
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-on-surface mb-0">Listing progress</p>
                <span className="text-sm font-semibold tabular-nums text-on-surface-variant">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden mb-4">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-1 mb-5">
                {checklist.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="w-full flex items-center gap-3 px-2 py-1.5 -mx-2 rounded-lg bg-transparent border-0 cursor-pointer text-left hover:bg-surface-container-low transition-colors">
                      <span className={`size-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${c.done ? 'bg-primary text-on-primary' : 'border-2 border-outline-variant'}`}>
                        {c.done && <Check className="size-3" />}
                      </span>
                      <span className={`text-sm flex-1 ${c.done ? 'text-on-surface' : 'text-on-surface-variant'}`}>{c.label}</span>
                      {c.optional && <span className="text-[11px] text-on-surface-variant">Optional</span>}
                    </button>
                  </li>
                ))}
              </ul>

              <button type="submit" disabled={isSubmitting}
                className="hidden lg:inline-flex w-full h-12 items-center justify-center gap-2 rounded-full border-0 bg-primary text-on-primary font-bold cursor-pointer shadow-md hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-wait">
                {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Publishing…</> : 'Publish listing'}
              </button>
              <Link to="/listing" className="hidden lg:block text-center text-sm font-semibold text-on-surface-variant no-underline mt-3 hover:text-on-surface">
                Cancel
              </Link>
            </div>

            {/* Tip */}
            <div className="rounded-2xl bg-primary/5 border border-primary/15 p-5 flex gap-3">
              <Lightbulb className="size-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-on-surface-variant mb-0">
                <span className="font-semibold text-on-surface">Tip:</span> listings with 5+ photos and at least 4 amenities tend to get booked much faster.
              </p>
            </div>
          </aside>

          {/* Mobile sticky action bar */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur border-t border-outline-variant/40 px-6 py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-on-surface-variant mb-1">{doneCount} of {required.length} steps done</p>
              <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="h-11 px-6 inline-flex items-center gap-2 rounded-full border-0 bg-primary text-on-primary font-bold cursor-pointer shadow-md disabled:opacity-70">
              {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Publishing…</> : 'Publish'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
