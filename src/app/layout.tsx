// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import DynamicHeader from '@/components/DynamicHeader';
import Footer from '@/components/Footer';
import Providers from './Providers';

export const metadata = {
  title: 'Dappshunt',
  description: 'Discover and support innovative projects on Solana',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <DynamicHeader />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
