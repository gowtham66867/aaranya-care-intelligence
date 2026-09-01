import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aaranya-care-intelligence.trilogy-1207.chatgpt.site'),
  title: 'Aaranya Care Intelligence',
  description: 'A human-supervised AI care agent for safer, more personal senior living.',
  openGraph: {
    title: 'Aaranya Care Intelligence',
    description: 'Safer care. Calmer teams. Closer families.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Aaranya Care Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aaranya Care Intelligence',
    description: 'Safer care. Calmer teams. Closer families.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
