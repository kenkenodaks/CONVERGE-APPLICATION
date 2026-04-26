'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Copy, Home, ArrowRight, Calendar, User, Hash } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';

function SuccessContent() {
  const params = useSearchParams();
  const applicationId = params.get('id') ?? 'CVG-UNKNOWN';
  const applicantName = params.get('name') ?? 'Applicant';
  const submittedAt = params.get('date') ?? new Date().toISOString();
  const [copied, setCopied] = useState(false);

  function copyId() {
    navigator.clipboard.writeText(applicationId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-b from-slate-50 to-blue-50/30">
      <div className="w-full max-w-md">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden animate-bounce-in">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500" />

          <div className="p-8 text-center">
            {/* Animated checkmark */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce-in" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-30" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Application Submitted!
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Thank you, <strong className="text-slate-700">{decodeURIComponent(applicantName)}</strong>!
              Your Converge fiber application has been received and is being processed.
            </p>

            {/* Application ID */}
            <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
                Application Reference
              </p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-lg font-bold text-blue-700 tracking-wider">
                  {applicationId}
                </code>
                <button
                  onClick={copyId}
                  className="w-8 h-8 bg-white rounded-lg border border-blue-200 flex items-center justify-center hover:bg-blue-50 transition-colors"
                  title="Copy reference number"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-blue-400 mt-2">Save this number for future reference</p>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-8 text-left">
              <DetailRow icon={<User />} label="Applicant" value={decodeURIComponent(applicantName)} />
              <DetailRow icon={<Hash />} label="Reference ID" value={applicationId} />
              <DetailRow icon={<Calendar />} label="Submitted" value={formatDate(submittedAt)} />
            </div>

            {/* What's next */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left border border-slate-100">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                What happens next?
              </p>
              <ol className="space-y-2.5">
                {[
                  'Your application is reviewed by our team (24–48 hrs)',
                  'A Converge representative will call to confirm',
                  'Installation is scheduled at your convenience',
                  'Go live and enjoy fiber internet!',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-blue transition-all duration-200 hover:-translate-y-0.5"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
              <a
                href="https://www.convergeict.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                Learn more about Converge
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Questions? Call{' '}
          <a href="tel:1700" className="text-blue-500 hover:underline font-medium">
            1700
          </a>{' '}
          or email{' '}
          <a
            href="mailto:customercare@convergeict.com"
            className="text-blue-500 hover:underline font-medium"
          >
            customercare@convergeict.com
          </a>
        </p>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
      <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 [&>svg]:w-3.5 [&>svg]:h-3.5 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
