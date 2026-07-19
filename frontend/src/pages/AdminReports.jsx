import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Flag, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminAPI, listingsAPI } from '../api';
import { REPORT_REASONS } from '../lib/reportReasons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/animate-ui/components/radix/toggle-group';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/animate-ui/components/radix/alert-dialog';

const reasonLabel = (value) => REPORT_REASONS.find((r) => r.value === value)?.label || value;

const STATUS_STYLES = {
  open: 'bg-tertiary/15 text-tertiary',
  resolved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  dismissed: 'bg-surface-container-high text-on-surface-variant',
};

const FILTERS = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
  { value: '', label: 'All' },
];

export const AdminReports = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('open');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/user/login'); return; }
    if (!user.isAdmin) { navigate('/'); return; }
    fetchReports();
  }, [user, authLoading, navigate]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getReports();
      setReports(res.data.reports || []);
    } catch {
      addToast('error', 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      const res = await adminAPI.updateReportStatus(id, status);
      setReports((prev) => prev.map((r) => (r._id === id ? res.data.report : r)));
      addToast('success', status === 'resolved' ? 'Marked as resolved' : 'Report dismissed');
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to update report');
    } finally {
      setBusyId(null);
    }
  };

  const deleteListing = async (report) => {
    setBusyId(report._id);
    try {
      await listingsAPI.deleteListing(report.listing._id);
      await adminAPI.updateReportStatus(report._id, 'resolved');
      setReports((prev) => prev.map((r) => (r._id === report._id ? { ...r, status: 'resolved' } : r)));
      addToast('success', 'Listing removed');
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to remove listing');
    } finally {
      setBusyId(null);
    }
  };

  const visibleReports = filter ? reports.filter((r) => r.status === filter) : reports;
  const openCount = reports.filter((r) => r.status === 'open').length;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-5xl mx-auto px-margin-mobile md:px-lg py-xl">
        <div className="flex items-center gap-3 mb-xl">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="text-primary size-5" />
          </div>
          <div>
            <h1 className="font-heading text-headline-lg text-on-surface mb-0.5">Reported listings</h1>
            <p className="text-on-surface-variant text-body-sm mb-0">
              {openCount > 0 ? `${openCount} open report${openCount !== 1 ? 's' : ''} awaiting review` : 'No open reports right now'}
            </p>
          </div>
        </div>

        <ToggleGroup type="single" value={filter} onValueChange={(v) => setFilter(v ?? '')} className="mb-lg gap-1">
          {FILTERS.map((f) => (
            <ToggleGroupItem key={f.value || 'all'} value={f.value} className="h-auto px-4 py-2 text-sm">
              {f.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {visibleReports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-md py-24 bg-surface-container-lowest">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <Flag className="size-6" />
            </div>
            <p className="font-semibold text-on-surface mb-0">Nothing here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {visibleReports.map((report) => (
              <Card key={report._id} className="p-lg shadow-sm border-outline-variant/30">
                <div className="flex items-start gap-lg flex-wrap">
                  {report.listing ? (
                    <Link to={`/listings/${report.listing._id}`} className="w-24 h-20 rounded-xl overflow-hidden shrink-0 block">
                      <img src={report.listing.image} alt={report.listing.title} className="w-full h-full object-cover" />
                    </Link>
                  ) : (
                    <div className="w-24 h-20 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant text-xs shrink-0">deleted</div>
                  )}

                  <div className="flex-1 min-w-50">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-heading text-body-lg font-bold text-on-surface mb-0">
                        {report.listing?.title || 'Listing no longer exists'}
                      </h3>
                      <span className={`text-label-sm font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${STATUS_STYLES[report.status]}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-body-sm mb-1">
                      <span className="font-semibold text-on-surface">{reasonLabel(report.reason)}</span>
                      {' · reported by '}{report.reporter?.username || 'unknown'}
                      {' · '}{new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    {report.details && (
                      <p className="text-on-surface-variant text-body-sm mb-0">{report.details}</p>
                    )}
                  </div>

                  {report.status === 'open' && (
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        disabled={busyId === report._id}
                        onClick={() => updateStatus(report._id, 'dismissed')}
                        className="rounded-full border-outline-variant flex-1 sm:flex-none"
                      >
                        <XCircle className="size-3.5" /> Dismiss
                      </Button>
                      <Button
                        disabled={busyId === report._id}
                        onClick={() => updateStatus(report._id, 'resolved')}
                        className="rounded-full bg-emerald-600 text-white border-0 hover:bg-emerald-700 flex-1 sm:flex-none"
                      >
                        <CheckCircle2 className="size-3.5" /> Resolve
                      </Button>
                      {report.listing && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={busyId === report._id} className="rounded-full">
                              <Trash2 className="size-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove this listing?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently deletes "{report.listing.title}" and its reviews, and marks this report as resolved. This can't be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteListing(report)} className="bg-destructive text-white hover:bg-destructive/90">
                                Remove listing
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
