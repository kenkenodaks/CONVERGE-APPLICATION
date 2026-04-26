import ApplicationForm from '@/components/ApplicationForm';
import { Wifi, Zap, Shield, Headphones, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800" />

        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Now Accepting Applications
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight">
            Blazing-Fast Fiber<br />
            <span className="text-blue-200">Internet at Home</span>
          </h1>

          <p className="text-blue-100/90 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            Apply for Converge Bida Fiber and experience uninterrupted speeds up to{' '}
            <strong className="text-white">100&nbsp;Mbps</strong> — for streaming, gaming, work from home, and everything in between.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mb-10 text-center">
            {[
              { value: '100 Mbps', label: 'Max Speed' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/#apply" className="btn-primary px-8 py-4 text-base">
              Apply for Free
            </Link>
            <Link href="/plans" className="btn-ghost px-8 py-4 text-base">
              View Plans
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <a
          href="#features"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 animate-slide-up">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Why Converge?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              The smarter choice for fiber
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Trusted by millions of Filipino households and businesses for reliable, high-speed connectivity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Ultra-Fast Speeds',
                desc: 'Symmetric upload and download speeds for seamless 4K streaming and gaming.',
                color: 'text-amber-500 bg-amber-50',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Secure Network',
                desc: 'Enterprise-grade security to keep your data safe at all times.',
                color: 'text-green-500 bg-green-50',
              },
              {
                icon: <Wifi className="w-6 h-6" />,
                title: 'Pure Fiber Optic',
                desc: 'Direct fiber-to-the-home (FTTH) — no copper degradation.',
                color: 'text-blue-500 bg-blue-50',
              },
              {
                icon: <Headphones className="w-6 h-6" />,
                title: '24/7 Support',
                desc: 'Round-the-clock technical support via hotline, chat, and app.',
                color: 'text-purple-500 bg-purple-50',
              },
            ].map(({ icon, title, desc, color }) => (
              <div
                key={title}
                className="card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Form ────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-blue-50/40">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Online Application
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Apply in minutes
            </h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm leading-relaxed">
              Fill out the form below and our team will reach out within 24–48 hours to
              schedule your installation.
            </p>
          </div>

          <ApplicationForm />
        </div>
      </section>
    </>
  );
}
