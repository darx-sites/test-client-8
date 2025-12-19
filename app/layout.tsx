import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/lib/builder';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Test Client 8 | Marketing Solutions',
  description: 'Professional marketing solutions for lead generation and brand presence. Partner with Test Client 8 for innovative marketing strategies.',
  keywords: 'marketing, lead generation, brand presence, digital marketing, marketing solutions',
  authors: [{ name: 'Test Client 8' }],
  openGraph: {
    title: 'Test Client 8 | Marketing Solutions',
    description: 'Professional marketing solutions for lead generation and brand presence.',
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