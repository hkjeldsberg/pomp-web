import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pomp',
  description: 'Treningslogg',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body className="bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
