'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Lock, Eye, EyeOff, Search, RefreshCw, ExternalLink,
  User, Calendar, FileText, LayoutDashboard, X,
  Image as ImageIcon, CheckCircle, Clock, TrendingUp,
} from 'lucide-react';
import type { DriveFolder } from '@/types';

// ─── localStorage helpers ─────────────────────────────────────────────────
const LS_KEY = 'cvg_reviewed_ids';

function getReviewedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveReviewedId(id: string) {
  const ids = getReviewedIds();
  ids.add(id);
  localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
}

// ─── Login Screen ─────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (secret: string) => void }) {
  const [secret, setSecret] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) { setError('Password is required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.status === 401) { setError('Invalid password'); return; }
      onLogin(secret);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 pt-16">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-blue">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={secret}
                onChange={(e) => { setSecret(e.target.value); setError(''); }}
                placeholder="Admin password"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1.5 animate-fade-in">
                <X className="w-3.5 h-3.5" />{error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl shadow-blue transition-all duration-200"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Verifying…' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────
function ApplicationCard({
  folder,
  isReviewed,
  onMarkReviewed,
}: {
  folder: DriveFolder;
  isReviewed: boolean;
  onMarkReviewed: (id: string) => void;
}) {
  const photoFile = folder.children?.find((f) => f.mimeType?.startsWith('image/'));

  const dateMatch = folder.name.match(/— (\d{4}-\d{2}-\d{2})$/);
  const dateStr = dateMatch
    ? new Date(dateMatch[1]).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : 'Unknown date';

  const applicantName = folder.name.replace(/ — \d{4}-\d{2}-\d{2}$/, '');
  const thumb = photoFile?.thumbnailLink;

  function handleOpenDrive() {
    if (!isReviewed) onMarkReviewed(folder.id);
    window.open(folder.webViewLink, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className={`card p-5 transition-all duration-300 group hover:shadow-card-hover ${isReviewed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Photo thumb */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={applicantName} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm truncate">{applicantName}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">{dateStr}</span>
              </div>
            </div>

            {/* Status badge */}
            {isReviewed ? (
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Reviewed
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-600 border border-amber-100 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            )}
          </div>

          {/* Files */}
          <div className="flex items-center gap-3 mt-3">
            {folder.children?.map((child) => (
              <a
                key={child.id}
                href={child.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                title={child.name}
              >
                {child.mimeType?.startsWith('image/') ? (
                  <ImageIcon className="w-3.5 h-3.5" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                {child.name.slice(0, 18)}{child.name.length > 18 ? '…' : ''}
              </a>
            ))}
          </div>
        </div>

        {/* Open in Drive button — marks as reviewed on click */}
        <button
          onClick={handleOpenDrive}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
            isReviewed
              ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
              : 'bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-500'
          }`}
          title={isReviewed ? 'Open in Google Drive (reviewed)' : 'Open in Google Drive — marks as reviewed'}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ adminSecret }: { adminSecret: string }) {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  // Load reviewed IDs from localStorage on mount
  useEffect(() => {
    setReviewedIds(getReviewedIds());
  }, []);

  function handleMarkReviewed(id: string) {
    saveReviewedId(id);
    setReviewedIds((prev) => new Set([...prev, id]));
  }

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${adminSecret}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to load');
      setFolders(json.data ?? []);
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [adminSecret]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const pendingCount = folders.filter((f) => !reviewedIds.has(f.id)).length;
  const reviewedCount = folders.filter((f) => reviewedIds.has(f.id)).length;
  const todayCount = folders.filter((f) =>
    f.createdTime?.startsWith(new Date().toISOString().slice(0, 10))
  ).length;

  const filtered = folders
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    .filter((f) => {
      if (filter === 'pending') return !reviewedIds.has(f.id);
      if (filter === 'reviewed') return reviewedIds.has(f.id);
      return true;
    });

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-blue">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Applications</h1>
              <p className="text-xs text-slate-400">
                {lastFetched ? `Updated ${lastFetched.toLocaleTimeString()}` : 'Loading…'}
              </p>
            </div>
          </div>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{folders.length}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Total</p>
          </div>
          <div
            className="card p-4 text-center cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
            title="Click to filter pending"
          >
            <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <p className="text-xs text-slate-400 font-medium">Pending</p>
            </div>
          </div>
          <div
            className="card p-4 text-center cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => setFilter(filter === 'reviewed' ? 'all' : 'reviewed')}
            title="Click to filter reviewed"
          >
            <p className="text-2xl font-bold text-emerald-500">{reviewedCount}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3 text-slate-400" />
              <p className="text-xs text-slate-400 font-medium">Reviewed</p>
            </div>
          </div>
        </div>

        {/* Active filter badge */}
        {filter !== 'all' && (
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              {filter === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
              Showing {filter} only
            </span>
            <button
              onClick={() => setFilter('all')}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Show all
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search by applicant name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-sm text-slate-400">Loading from Google Drive…</p>
          </div>
        ) : error ? (
          <div className="card p-8 text-center border-red-100">
            <p className="text-red-500 font-medium mb-1">Failed to load</p>
            <p className="text-sm text-slate-400">{error}</p>
            <button onClick={fetchApplications} className="mt-4 text-sm text-blue-500 hover:text-blue-700 font-medium">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-500">
              {search || filter !== 'all' ? 'No applications match' : 'No applications yet'}
            </p>
            {(search || filter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilter('all'); }}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((folder) => (
              <ApplicationCard
                key={folder.id}
                folder={folder}
                isReviewed={reviewedIds.has(folder.id)}
                onMarkReviewed={handleMarkReviewed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  if (!adminSecret) return <LoginScreen onLogin={setAdminSecret} />;
  return <Dashboard adminSecret={adminSecret} />;
}
