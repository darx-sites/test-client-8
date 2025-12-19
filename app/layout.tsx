import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/lib/builder';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'test-client-8 | Builder.io Integration Test',
  description: 'Testing Builder.io and Vercel synchronization for test-client-8',
  keywords: ['test', 'builder.io', 'vercel', 'integration'],
  authors: [{ name: 'test-client-8' }],
  openGraph: {
    title: 'test-client-8 | Builder.io Integration Test',
    description: 'Testing Builder.io and Vercel synchronization',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}