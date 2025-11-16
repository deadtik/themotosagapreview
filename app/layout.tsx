import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Moto Saga - India\'s Premium Riding Community',
  description: 'Unite with riders, creators & clubs. Share your journey, discover epic rides, join legendary events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">{children}</body>
    </html>
  );
}
