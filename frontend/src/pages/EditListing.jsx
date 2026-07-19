import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, UploadCloud, X, PenLine, Images, MapPin, Users, Sparkles,
} from 'lucide-react';
import { listingsAPI } from '../api';
import { AMENITIES } from '../lib/amenities';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/animate-ui/components/buttons/button';

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-lg">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="size-4 text-primary" />
    </div>
    <div>
      <h2 className="font-heading text-body-lg font-bold text-on-surface mb-0">{title}</h2>
      {subtitle && <p className="text-body-sm text-on-surface-variant mb-0">{subtitle}</p>}
    </div>
  </div>
);

const fieldClass = 'h-11 rounded-xl bg-surface-container-low border-outline-variant';

export const EditListing = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', country: '', price: '',
    guests: '1', bedrooms: '1', bathrooms: '1',
  });
  const [amenities, setAmenities] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);
  const [removedGallery, setRemovedGallery] = useState([]);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchListing(); }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingsAPI.getEditPage(id);
      const l = response.data.listing;
      setFormData({
        title: l.title, description: l.description, location: l.location, country: l.country, price: l.price,
        guests: l.guests || 1, bedrooms: l.bedrooms || 1, bathrooms: l.bathrooms || 1,
      });
      setAmenities(l.amenities || []);
      setCurrentImage(l.image);
      setExistingGallery(l.images || []);
    } catch { setErrors({ fetch: 'Failed to load listing' }); }
    finally { setIsLoading(false); }
  };

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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleAmenity = (value) => {
    setAmenities(prev => prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]);
  };

  const MAX_GALLERY = 6;
  const galleryCount = existingGallery.length + newGalleryImages.length;

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_GALLERY - galleryCount);
    setNewGalleryImages(prev => [...prev, ...files]);
    setNewGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeExistingGalleryImage = (url) => {
    setExistingGallery(prev => prev.filter((u) => u !== url));
    setRemovedGallery(prev => [...prev, url]);
  };

  const removeNewGalleryImage = (index) => {
    setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews(prev => prev.filter((_, i) => i !== index));
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
      if (newImage) data.append('lististing[image]', newImage);
      if (removedGallery.length) data.append('removeImages', JSON.stringify(removedGallery));
      newGalleryImages.forEach((file) => data.append('lististing[images]', file));
      await listingsAPI.updateListing(id, data);
      navigate(`/listings/${id}`);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to update listing' });
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="w-9 h-9 border-4 border-surface-container-high border-t-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-on-surface-variant text-sm mb-0">Loading listing...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-3xl mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="mb-xl">
          <Link to={`/listings/${id}`} className="inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant no-underline mb-md hover:text-on-surface transition-colors">
            <ArrowLeft className="size-3.5" /> Back to listing
          </Link>
          <h1 className="font-heading text-headline-lg text-on-surface mb-1">Edit listing</h1>
          <p className="text-on-surface-variant text-body-sm mb-0">Update your listing details.</p>
        </div>

        {(errors.submit || errors.fetch) && (
          <div className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm mb-lg">
            {errors.submit || errors.fetch}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Card className="p-xl shadow-sm border-outline-variant/30">
            {/* Basics */}
            <section className="border-b border-outline-variant/30 pb-xl mb-xl">
              <SectionHeading icon={PenLine} title="The basics" subtitle="Give travelers a reason to click" />
              <div className="flex flex-col gap-4.5">
                <div>
                  <Label className="mb-1.5">Title <span className="text-destructive">*</span></Label>
                  <Input name="title" type="text" value={formData.title} onChange={handleChange}
                    className={fieldClass} aria-invalid={!!errors.title} />
                  {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                </div>
                <div>
                  <Label className="mb-1.5">Description <span className="text-destructive">*</span></Label>
                  <Textarea name="description" rows="4" value={formData.description} onChange={handleChange}
                    className="rounded-xl bg-surface-container-low border-outline-variant resize-none" aria-invalid={!!errors.description} />
                  {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                </div>
              </div>
            </section>

            {/* Photos */}
            <section className="border-b border-outline-variant/30 pb-xl mb-xl">
              <SectionHeading icon={Images} title="Photos" subtitle="A great cover photo makes all the difference" />
              <div className="flex flex-col gap-4.5">
                <div>
                  <Label className="mb-1.5">Cover photo</Label>
                  <div className="rounded-xl overflow-hidden h-52 mb-2.5 shadow-sm">
                    <img src={preview || currentImage} alt="listing" className="w-full h-full object-cover" />
                  </div>
                  <label className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low cursor-pointer text-body-sm text-on-surface-variant transition-all hover:border-primary hover:bg-primary/5">
                    <UploadCloud className="size-4" />
                    <span>{newImage ? newImage.name : 'Upload new cover photo (optional)'}</span>
                    <input type="file" className="hidden" onChange={e => { const f = e.target.files[0]; setNewImage(f); if (f) setPreview(URL.createObjectURL(f)); }} accept="image/*" />
                  </label>
                </div>

                <div>
                  <Label className="mb-1.5">Gallery photos <span className="text-on-surface-variant font-normal">(optional, up to {MAX_GALLERY})</span></Label>
                  {(existingGallery.length > 0 || newGalleryPreviews.length > 0) && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {existingGallery.map((url) => (
                        <div key={url} className="relative rounded-xl overflow-hidden h-24 shadow-sm">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeExistingGalleryImage(url)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-surface-container-lowest border-0 cursor-pointer text-on-surface-variant shadow-md flex items-center justify-center hover:text-on-surface">
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                      {newGalleryPreviews.map((src, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden h-24 shadow-sm">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeNewGalleryImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-surface-container-lowest border-0 cursor-pointer text-on-surface-variant shadow-md flex items-center justify-center hover:text-on-surface">
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {galleryCount < MAX_GALLERY && (
                    <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low cursor-pointer transition-all h-24 hover:border-primary hover:bg-primary/5">
                      <UploadCloud className="size-5 text-on-surface-variant/60 mb-1" />
                      <span className="text-xs text-on-surface-variant">Add more photos</span>
                      <input type="file" className="hidden" onChange={handleGalleryChange} accept="image/*" multiple />
                    </label>
                  )}
                </div>
              </div>
            </section>

            {/* Location & pricing */}
            <section className="border-b border-outline-variant/30 pb-xl mb-xl">
              <SectionHeading icon={MapPin} title="Location & pricing" subtitle="Where guests will stay, and what it costs" />
              <div className="flex flex-col gap-4.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5">Location <span className="text-destructive">*</span></Label>
                    <Input name="location" type="text" value={formData.location} onChange={handleChange}
                      className={fieldClass} aria-invalid={!!errors.location} />
                    {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <Label className="mb-1.5">Country <span className="text-destructive">*</span></Label>
                    <Input name="country" type="text" value={formData.country} onChange={handleChange}
                      className={fieldClass} aria-invalid={!!errors.country} />
                    {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5">Price per night <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                    <Input name="price" type="number" value={formData.price} onChange={handleChange}
                      className={`${fieldClass} pl-7`} aria-invalid={!!errors.price} />
                  </div>
                  {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
                </div>
              </div>
            </section>

            {/* Capacity */}
            <section className="border-b border-outline-variant/30 pb-xl mb-xl">
              <SectionHeading icon={Users} title="Capacity" subtitle="How many guests your place comfortably fits" />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1.5">Guests <span className="text-destructive">*</span></Label>
                  <Input name="guests" type="number" min="1" value={formData.guests} onChange={handleChange}
                    className={fieldClass} aria-invalid={!!errors.guests} />
                  {errors.guests && <p className="text-xs text-destructive mt-1">{errors.guests}</p>}
                </div>
                <div>
                  <Label className="mb-1.5">Bedrooms <span className="text-destructive">*</span></Label>
                  <Input name="bedrooms" type="number" min="1" value={formData.bedrooms} onChange={handleChange}
                    className={fieldClass} aria-invalid={!!errors.bedrooms} />
                  {errors.bedrooms && <p className="text-xs text-destructive mt-1">{errors.bedrooms}</p>}
                </div>
                <div>
                  <Label className="mb-1.5">Bathrooms <span className="text-destructive">*</span></Label>
                  <Input name="bathrooms" type="number" min="0.5" step="0.5" value={formData.bathrooms} onChange={handleChange}
                    className={fieldClass} aria-invalid={!!errors.bathrooms} />
                  {errors.bathrooms && <p className="text-xs text-destructive mt-1">{errors.bathrooms}</p>}
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <SectionHeading icon={Sparkles} title="Amenities" subtitle="Select everything your place offers" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AMENITIES.map(({ value, label, icon: Icon }) => {
                  const checked = amenities.includes(value);
                  return (
                    <label key={value}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${checked ? 'border-primary bg-primary/10 text-on-surface' : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/50'}`}>
                      <input type="checkbox" className="hidden" checked={checked} onChange={() => toggleAmenity(value)} />
                      <Icon className="size-4 shrink-0" />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          </Card>

          <div className="flex gap-3 mt-xl">
            <Button type="submit" disabled={isSubmitting} size="lg"
              className="flex-1 rounded-full bg-primary text-on-primary font-bold border-0 shadow-md hover:shadow-lg">
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold border-outline-variant">
              <Link to={`/listings/${id}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
