"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface PaywallBlurProps {
  children: ReactNode;
  isActive: boolean;
}

export function PaywallBlur({ children, isActive }: PaywallBlurProps) {
  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="blur-lg pointer-events-none select-none">
        {children}
      </div>
      
      {/* Paywall Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-transparent via-black/20 to-black/40 rounded-xl">
        <div className="glass-panel p-8 max-w-md w-full border-2 border-[color:var(--accent-primary)]/30 bg-[color:var(--background-overlay)]/90 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[color:var(--accent-primary)] to-[color:var(--accent-warm)] mb-4">
              <span className="text-2xl font-bold text-white">🔒</span>
            </div>
            
            <h3 className="text-2xl font-bold text-[color:var(--text-primary)]">
              Upgrade to Growth Seat
            </h3>
            
            <p className="text-[color:var(--text-secondary)] leading-relaxed">
              This content is part of the exclusive Founder Hub community. 
              Upgrade your membership to access full benchmarking data, 
              private discussions, and the complete founder network.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                <span className="text-sm text-[color:var(--text-secondary)]">Full Benchmarking Access</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                <span className="text-sm text-[color:var(--text-secondary)]">Private Founder Community</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                <span className="text-sm text-[color:var(--text-secondary)]">War Room Discussions</span>
              </div>
            </div>
            
            <Link 
              href="/billing"
              className="inline-block w-full mt-6 btn-primary py-4 rounded-lg text-lg font-bold text-center"
            >
              Upgrade Now – $20/month
            </Link>
            
            <p className="text-xs text-[color:var(--text-tertiary)] mt-4">
              Early member rate • Cancel anytime • Price locked at $20/mo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}