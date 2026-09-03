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
  title: 'Aaranya WholeLife Intelligence',
  description: 'A human-supervised wellness intelligence system with evidence-grounded recommendations and inspectable agent runs.',
  openGraph: {
    title: 'Aaranya WholeLife Intelligence',
    description: 'Seven signals. Six supervised stages. One human decision.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Aaranya WholeLife Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aaranya WholeLife Intelligence',
    description: 'Seven signals. Six supervised stages. One human decision.',
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
