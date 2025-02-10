'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { Moon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ConnectWalletButton } from './connect-wallet-button';
import NavLink from './nav-link';
import { Button } from './ui/button';

const Header = () => {
  const { toggleTheme } = useThemeStore();

  return (
    <header className="flex relative h-16 items-center justify-between bg-content mx-5 mt-6 px-5 rounded-3xl ">
      <Link href="/">
        <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">Bleu</h1>
      </Link>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 text-lg">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/theme-showcase">Theme Showcase</NavLink>
      </div>
      <div className="flex items-center gap-2">
        <ConnectWalletButton />
        <Button
          variant="ghost"
          className="flex items-center justify-center rounded-full bg-primary/10 p-1 w-8 h-8 "
          onClick={() => toggleTheme()}
        >
          <Moon size={18} className="text-primary" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
