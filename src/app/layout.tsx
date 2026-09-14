import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dawa-legal.vercel.app'),
  title: {
    default: 'Dawa — Associate Practice Journal & Competency Dashboard',
    template: '%s | Dawa — Mehrteab & Getu Advocates LLP',
  },
  description:
    'Dawa is an executive legal practice management, competency tracking, daily task coordination, and knowledge base platform tailored for Advocates & Associates at Mehrteab & Getu Advocates LLP (Addis Ababa, Ethiopia).',
  applicationName: 'Dawa',
  authors: [
    { name: 'Mehrteab & Getu Advocates LLP' },
    { name: 'lost-from-ilght' },
  ],
  generator: 'Next.js',
  keywords: [
    'Dawa',
    'Dawa Legal Journal',
    'Mehrteab & Getu Advocates LLP',
    'MLA',
    'Ethiopian Law Practice',
    'Associate Practice Journal',
    'Legal Competency Dashboard',
    'Addis Ababa Law Firm',
    'Ethiopian Commercial Code',
    'Legal Practice Management Ethiopia',
    'Case and Deadline Tracker',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Mehrteab & Getu Advocates LLP',
  publisher: 'Dawa Legal Practice Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Dawa Legal Journal',
    title: 'Dawa — Associate Practice Journal & Competency Dashboard',
    description:
      'Executive legal practice management and competency tracking across 8 core Ethiopian practice areas for Mehrteab & Getu Advocates LLP.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dawa — Associate Practice Journal & Competency Dashboard',
    description:
      'Executive legal practice management and competency tracking for Mehrteab & Getu Advocates LLP (Addis Ababa, Ethiopia).',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'Dawa Journal',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#070C1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
