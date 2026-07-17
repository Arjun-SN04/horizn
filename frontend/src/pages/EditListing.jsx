import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { listingsAPI } from '../api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/animate-ui/components/buttons/button';

export const EditListing = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', location: '', country: '', price: '' });
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchListing(); }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingsAPI.getEditPage(id);
      const l = response.data.listing;
      setFormData({ title: l.title, description: l.description, location: l.location, country: l.country, price: l.price });
      setCurrentImage(l.image);
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
      if (newImage) data.append('lististing[image]', newImage);
      await listingsAPI.updateListing(id, data);
      navigate(`/listings/${id}`);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to update listing' });
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="text-center">
        <div className="w-9 h-9 border-3 border-muted border-t-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted-foreground text-xs mb-0">Loading listing...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <Link to={`/listings/${id}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground no-underline mb-3 hover:text-foreground">
            <ArrowLeft className="size-3" /> Back to listing
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-0 tracking-tight">Edit Listing</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-0">Update your listing details</p>
        </div>

        <Card className="p-8 shadow-sm">
          {(errors.submit || errors.fetch) && (
            <div className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-xs mb-5">
              {errors.submit || errors.fetch}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4.5">
            <div>
              <Label className="mb-1.5">Title <span className="text-destructive">*</span></Label>
              <Input name="title" type="text" value={formData.title} onChange={handleChange}
                className="h-11 rounded-xl bg-muted/40" aria-invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label className="mb-1.5">Description <span className="text-destructive">*</span></Label>
              <Textarea name="description" rows="4" value={formData.description} onChange={handleChange}
                className="rounded-xl bg-muted/40 resize-none" aria-invalid={!!errors.description} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>

            {/* Current / New Image */}
            <div>
              <Label className="mb-1.5">Photo</Label>
              <div className="rounded-xl overflow-hidden h-48 mb-2.5">
                <img src={preview || currentImage} alt="listing" className="w-full h-full object-cover" />
              </div>
              <label className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-input bg-muted/40 cursor-pointer text-xs text-muted-foreground transition-all hover:border-primary hover:bg-primary/5">
                <UploadCloud className="size-4" />
                <span>{newImage ? newImage.name : 'Upload new photo (optional)'}</span>
                <input type="file" className="hidden" onChange={e => { const f = e.target.files[0]; setNewImage(f); if (f) setPreview(URL.createObjectURL(f)); }} accept="image/*" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5">Price / night <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input name="price" type="number" value={formData.price} onChange={handleChange}
                    className="h-11 rounded-xl bg-muted/40 pl-7" aria-invalid={!!errors.price} />
                </div>
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label className="mb-1.5">Location <span className="text-destructive">*</span></Label>
                <Input name="location" type="text" value={formData.location} onChange={handleChange}
                  className="h-11 rounded-xl bg-muted/40" aria-invalid={!!errors.location} />
                {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
              </div>
            </div>

            <div>
              <Label className="mb-1.5">Country <span className="text-destructive">*</span></Label>
              <Input name="country" type="text" value={formData.country} onChange={handleChange}
                className="h-11 rounded-xl bg-muted/40" aria-invalid={!!errors.country} />
              {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
            </div>

            <div className="flex gap-3 mt-1.5">
              <Button type="submit" disabled={isSubmitting} size="lg"
                className="flex-1 rounded-full bg-primary text-on-primary font-bold border-0 shadow-md hover:shadow-lg">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold">
                <Link to={`/listings/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
