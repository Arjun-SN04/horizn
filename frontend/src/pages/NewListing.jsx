import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import { listingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/animate-ui/components/buttons/button';

export const NewListing = () => {
  const [formData, setFormData] = useState({ title: '', description: '', location: '', country: '', price: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!image) e.image = 'Image is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
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
      data.append('lististing[image]', image);
      await listingsAPI.createListing(data);
      navigate('/listing');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to create listing' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <Link to="/listing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground no-underline mb-3 hover:text-foreground">
            <ArrowLeft className="size-3" /> Back to listings
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-0 tracking-tight">Add New Listing</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-0">Share your space with travelers worldwide</p>
        </div>

        <Card className="p-8 shadow-sm">
          {errors.submit && (
            <div className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-xs mb-5">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4.5">
            {/* Title */}
            <div>
              <Label className="mb-1.5">Title <span className="text-destructive">*</span></Label>
              <Input name="title" type="text" value={formData.title} onChange={handleChange}
                placeholder="Give your listing a catchy title" className="h-11 rounded-xl bg-muted/40"
                aria-invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <Label className="mb-1.5">Description <span className="text-destructive">*</span></Label>
              <Textarea name="description" rows="4" value={formData.description} onChange={handleChange}
                placeholder="Describe what makes your place special..." className="rounded-xl bg-muted/40 resize-none"
                aria-invalid={!!errors.description} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <Label className="mb-1.5">Photo <span className="text-destructive">*</span></Label>
              {preview ? (
                <div className="relative rounded-xl overflow-hidden h-52 mb-2">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setPreview(null); setImage(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background border-0 cursor-pointer text-muted-foreground shadow-md flex items-center justify-center hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full rounded-xl border-2 cursor-pointer transition-all h-36 ${errors.image ? 'border-destructive/50 bg-destructive/5' : 'border-dashed border-input bg-muted/40 hover:border-primary hover:bg-primary/5'}`}>
                  <UploadCloud className="size-6 text-muted-foreground/60 mb-2" />
                  <span className="text-xs text-muted-foreground">Click to upload image</span>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
              {errors.image && <p className="text-xs text-destructive mt-1">{errors.image}</p>}
            </div>

            {/* Price + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5">Price / night <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input name="price" type="number" value={formData.price} onChange={handleChange}
                    placeholder="1200" className="h-11 rounded-xl bg-muted/40 pl-7"
                    aria-invalid={!!errors.price} />
                </div>
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label className="mb-1.5">Location <span className="text-destructive">*</span></Label>
                <Input name="location" type="text" value={formData.location} onChange={handleChange}
                  placeholder="City, State" className="h-11 rounded-xl bg-muted/40"
                  aria-invalid={!!errors.location} />
                {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Country */}
            <div>
              <Label className="mb-1.5">Country <span className="text-destructive">*</span></Label>
              <Input name="country" type="text" value={formData.country} onChange={handleChange}
                placeholder="India" className="h-11 rounded-xl bg-muted/40"
                aria-invalid={!!errors.country} />
              {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} size="lg"
              className="w-full rounded-full bg-primary text-on-primary font-bold border-0 shadow-md hover:shadow-lg mt-1.5">
              {isSubmitting ? 'Creating listing...' : 'Create Listing'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
