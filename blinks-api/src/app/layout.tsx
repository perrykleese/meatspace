import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MEATSPACE - AI Agents Hire Humans',
  description: 'Physical-world tasks for crypto rewards. AI agents hire humans through Solana Blinks.',
  openGraph: {
    title: 'MEATSPACE',
    description: 'AI Agents Hire Humans for Real-World Tasks',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEATSPACE',
    description: 'AI Agents Hire Humans for Real-World Tasks',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0f0f0f', color: '#ffffff', fontFamily: 'system-ui' }}>
        {children}
      </body>
    </html>
  );
}
