import Link from 'next/link';
import {
  Wifi, Tv, Users, Zap, CheckCircle, ArrowRight, Star,
} from 'lucide-react';

const plans = [
  {
    name: 'Plan 888',
    price: '888',
    speed: '75',
    unit: 'Mbps',
    color: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-500',
    ring: 'ring-blue-400',
    glow: 'shadow-blue',
    highlight: false,
    perks: [
      '75 Mbps download speed',
      'Maximum 8 users',
      'WiFi only — no LAN ports',
      'Unlimited data usage',
      'Free fiber modem/router',
      'Professional installation',
      '24/7 customer support',
    ],
    extras: null,
  },
  {
    name: 'Plan 999',
    price: '999',
    speed: '100',
    unit: 'Mbps',
    color: 'from-purple-600 to-blue-700',
    badge: 'bg-yellow-400',
    ring: 'ring-purple-400',
    glow: 'shadow-[0_4px_24px_rgba(147,51,234,0.35)]',
    highlight: true,
    perks: [
      '100 Mbps download speed',
      'Maximum 8 users',
      'WiFi only — no LAN ports',
      'Unlimited data usage',
      'Free fiber modem/router',
      'Professional installation',
      '24/7 customer support',
    ],
    extras: null,
  },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-[#060B1F] pt-16">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-current" />
            New Promo
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Experience
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Ultra-Fast Fiber Internet
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-4">
            Choose the plan that fits your lifestyle. All plans include unlimited data
            and support for up to <span className="text-white font-semibold">8 users</span>.
          </p>

          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Users className="w-4 h-4 text-blue-400" />
            Up to 8 users &nbsp;·&nbsp;
            <Zap className="w-4 h-4 text-yellow-400" />
            Unlimited data &nbsp;·&nbsp;
            <Wifi className="w-4 h-4 text-purple-400" />
            Pure fiber optic
          </div>
        </div>
      </div>

      {/* ── Plan Cards ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'border-purple-500/50 ring-1 ring-purple-400/30'
                  : 'border-blue-500/30'
              }`}
            >
              {/* Card gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-10`} />
              <div className="absolute inset-0 bg-[#0A1020]" style={{ zIndex: -1 }} />

              {/* Most popular badge */}
              {plan.highlight && (
                <div className="absolute top-5 right-5 bg-yellow-400 text-[#0A1020] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="relative z-10 p-8">
                {/* Plan name & speed */}
                <div className={`inline-block bg-gradient-to-r ${plan.color} text-white text-sm font-bold px-4 py-1.5 rounded-lg mb-6`}>
                  {plan.name}
                </div>

                {/* Speed display */}
                <div className="mb-2">
                  <span className="text-7xl font-extrabold text-white leading-none">
                    {plan.speed}
                  </span>
                  <span className="text-2xl font-bold text-slate-400 ml-1">{plan.unit}</span>
                </div>
                <p className="text-slate-400 text-sm mb-1">Download Speed</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mt-5 mb-6">
                  <span className="text-slate-400 text-lg">₱</span>
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>

                {/* Sky Cignal bonus */}
                {plan.extras && (
                  <div className="flex items-center gap-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 mb-6">
                    <Tv className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-purple-300 font-bold text-sm">+ {plan.extras}</p>
                      <p className="text-slate-500 text-xs">Free cable TV included</p>
                    </div>
                  </div>
                )}

                {/* Perks */}
                <ul className="space-y-3 mb-8">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/#apply"
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_4px_14px_rgba(147,51,234,0.4)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.5)]'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue hover:shadow-lg'
                  }`}
                >
                  Apply for {plan.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom note ──────────────────────────────────────────── */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Not sure which plan to choose?{' '}
            <a href="tel:09292391719" className="text-blue-400 hover:text-blue-300 font-medium">
              Call 09292391719
            </a>{' '}
            and we'll help you decide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
            {[
              { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: 'Fast Installation' },
              { icon: <Users className="w-4 h-4 text-blue-400" />, label: 'Up to 8 Users' },
              { icon: <Wifi className="w-4 h-4 text-purple-400" />, label: 'Pure Fiber Optic' },
              { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, label: 'No Contract Lock-in' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-400 text-sm">
                {icon}
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
