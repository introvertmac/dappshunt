// src/app/Providers.tsx
'use client';

import { ReactNode } from 'react';
import WalletProvider from '@/components/WalletProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
