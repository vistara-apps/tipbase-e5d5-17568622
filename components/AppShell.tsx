'use client';

import { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="container max-w-xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
