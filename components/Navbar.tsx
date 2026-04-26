'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Wifi } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-blue group-hover:scale-105 transition-transform duration-200">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-slate-900 text-lg tracking-tight">Converge</span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Fiber Internet
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
            >
              Home
            </Link>
            <Link
              href="/#apply"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
            >
              Apply
            </Link>
            <Link
              href="/plans"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
            >
              Plans
            </Link>
            <Link
              href="/#apply"
              className="ml-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-blue hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4 pt-1 border-t border-slate-100 animate-fade-in">
            <div className="flex flex-col gap-1 mt-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/#apply', label: 'Apply' },
                { href: '/plans', label: 'Plans' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/#apply"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
