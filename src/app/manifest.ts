import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dawa — Legal Practice & Competency Journal',
    short_name: 'Dawa',
    description: 'Executive legal practice management and competency tracking for Mehrteab & Getu Advocates LLP',
    start_url: '/',
    display: 'standalone',
    background_color: '#070C1A',
    theme_color: '#070C1A',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
