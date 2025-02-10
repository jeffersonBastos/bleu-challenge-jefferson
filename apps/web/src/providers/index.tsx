'use client';
import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-proviver';
import { Web3Provider } from './web3-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <Web3Provider>{children}</Web3Provider>
    </ThemeProvider>
  );
}
