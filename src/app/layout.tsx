import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mehrteab & Getu Advocates LLP — Associate Practice Journal & Competency Dashboard',
  description:
    'Executive legal practice management, competency tracking across MLA 8 practice areas, 2-way synced daily to-do, lessons learned knowledge base, and deadline monitoring for Associates at Mehrteab & Getu Advocates LLP (Addis Ababa, Ethiopia).',
  keywords: [
    'MLA',
    'Mehrteab & Getu Advocates LLP',
    'Ethiopian Law',
    'Associate Legal Journal',
    'Legal Competency',
    'Addis Ababa Advocates',
    'Commercial Code Ethiopia',
  ],
  authors: [{ name: 'MLA Associate' }],
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
