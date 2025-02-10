'use client';

import { useThemeStore } from '@/store/useThemeStore';
import React from 'react';
import { Button } from './ui/button';

export default function ThemeShowcase() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex flex-1 min-h-screen">
      <div className="flex flex-col gap-6 items-center p-8 justify-center flex-1 ">
        <h1 className="text-2xl font-bold text-foreground mb-4">Theme Color Showcase</h1>

        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-foreground">Current theme: {theme}</p>
          <Button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Toggle Theme
          </Button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="bg-background p-6 rounded-lg border border-foreground/10">
            <h2 className="font-bold text-foreground mb-2">Background</h2>
            <p className="text-foreground/70">Background with foreground text</p>
          </div>

          <div className="bg-primary p-6 rounded-lg">
            <h2 className="font-bold text-primary-foreground mb-2">Primary</h2>
            <p className="text-primary-foreground/70">Primary with its foreground</p>
          </div>

          <div className="bg-content p-6 rounded-lg">
            <h2 className="font-bold text-content-foreground mb-2">Content</h2>
            <p className="text-content-foreground/70">Content with its foreground</p>
          </div>

          <div className="p-6 rounded-lg border border-sub-text">
            <h2 className="font-bold text-sub-text mb-2">Sub Text</h2>
            <p className="text-sub-text">Secondary text color</p>
          </div>
        </section>

        {/* Status Colors */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="bg-success/20 p-6 rounded-lg border-l-4 border-success">
            <h2 className="font-bold text-success mb-2">Success</h2>
            <p className="text-foreground/70">Used for success states</p>
          </div>

          <div className="bg-important/20 p-6 rounded-lg border-l-4 border-important">
            <h2 className="font-bold text-important mb-2">Important</h2>
            <p className="text-foreground/70">Used for important notices</p>
          </div>

          <div className="bg-caution/20 p-6 rounded-lg border-l-4 border-caution">
            <h2 className="font-bold text-caution mb-2">Caution</h2>
            <p className="text-foreground/70">Used for warning states</p>
          </div>

          <div className="bg-error/20 p-6 rounded-lg border-l-4 border-error">
            <h2 className="font-bold text-error mb-2">Error</h2>
            <p className="text-foreground/70">Used for error states</p>
          </div>
        </section>
      </div>
    </div>
  );
}
