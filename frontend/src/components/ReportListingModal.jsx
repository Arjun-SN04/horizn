import React, { useState } from 'react';
import { reportsAPI } from '../api';
import { useToast } from '../context/ToastContext';
import { REPORT_REASONS } from '../lib/reportReasons';
import { Modal } from './Modal';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/animate-ui/components/buttons/button';

export const ReportListingModal = ({ open, onClose, listingId }) => {
  const { addToast } = useToast();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => { setReason(''); setDetails(''); setError(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) { setError('Please select a reason.'); return; }
    setIsSubmitting(true);
    setError('');
    try {
      await reportsAPI.reportListing(listingId, { reason, details });
      addToast('success', "Thanks — we'll review this listing.");
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Report this listing" maxWidthClass="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {REPORT_REASONS.map((r) => (
            <label
              key={r.value}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${reason === r.value ? 'border-primary bg-primary/10 text-on-surface' : 'border-outline-variant text-on-surface-variant hover:border-primary/50'}`}
            >
              <input
                type="radio"
                name="reason"
                className="accent-primary"
                checked={reason === r.value}
                onChange={() => { setReason(r.value); setError(''); }}
              />
              {r.label}
            </label>
          ))}
        </div>

        <div>
          <Textarea
            rows="3"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Additional details (optional)"
            className="rounded-xl bg-surface-container-low"
          />
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" className="rounded-full" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="rounded-full bg-destructive text-white border-0 hover:bg-destructive/90">
            {isSubmitting ? 'Submitting...' : 'Submit report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
