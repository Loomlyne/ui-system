import type { Metadata } from 'next';
import '@ui-system/react/ui.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'UI System Playground',
  description: 'Set a brand once: colors, radius, type, logo and navigation. Preview it on a website and an app, then export the config.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
