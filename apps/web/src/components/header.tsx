"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { ConnectWalletButton } from "./connect-wallet-button";
import NavLink from "./nav-link";
import { Button } from "./ui/button";

const Header = () => {
  const { toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-content mx-5 mt-6 px-5 rounded-3xl h-16 relative">
      <Link href="/">
        <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">
          Bleu
        </h1>
      </Link>

      <nav className="hidden md:flex gap-4 text-lg">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/rewards">Claim Rewards</NavLink>
      </nav>
      <div className="flex items-center gap-2">
        <ConnectWalletButton />
        <Button
          variant="ghost"
          className="flex items-center justify-center rounded-full bg-primary/10 p-1 w-8 h-8"
          onClick={() => toggleTheme()}
        >
          <Moon size={18} className="text-primary" />
        </Button>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md bg-primary/10"
          >
            <Menu size={24} className="text-primary" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-content rounded-3xl p-8 w-11/12 max-w-sm relative">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-md bg-primary/10"
            >
              <X size={24} className="text-primary" />
            </button>
            <nav className="flex flex-col gap-4 text-lg">
              <NavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink href="/rewards" onClick={() => setMobileMenuOpen(false)}>
                Claim Rewards
              </NavLink>
              <NavLink
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
