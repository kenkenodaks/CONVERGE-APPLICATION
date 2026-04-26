import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Converge Fiber Internet — Apply Online',
  description:
    'Apply for Converge Fiber Internet online. Fill out the form and we will get back to you within 24–48 hours.',
  keywords: ['Converge', 'fiber internet', 'Philippines', 'ISP', 'apply'],
  openGraph: {
    title: 'Converge Fiber Internet — Apply Online',
    description: 'Fast, reliable fiber internet for your home. Apply in minutes.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </body>
    </html>
  );
}
