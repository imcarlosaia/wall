import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wall',
  description: 'A 2008-style profile wall. Leave a message and watch the feed update live.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
