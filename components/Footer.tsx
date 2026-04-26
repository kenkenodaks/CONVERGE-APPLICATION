import { Wifi, Phone, Mail, MapPin, Facebook, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Converge ICT</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Delivering blazing-fast fiber internet to Filipino homes and
              businesses. Connect to what matters most.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.facebook.com/ConvergeICTSolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.convergeict.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/#apply', label: 'Apply for Fiber' },
                { href: '/admin', label: 'Admin Dashboard' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-white transition-colors duration-150 hover:underline underline-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>09292391719</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>customercare@convergeict.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Nationwide — Philippines</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Converge ICT Solutions, Inc. All rights reserved.</p>
          <p className="text-xs">Application System v1.0</p>
        </div>
      </div>
    </footer>
  );
}
