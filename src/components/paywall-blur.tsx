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
    <div className="relative w-full h-full">
      {/* Blurred Content - takes full height of parent */}
      <div className="blur-lg pointer-events-none select-none w-full h-full overflow-hidden">
        {children}
      </div>
      
      {/* Paywall Overlay - centered within the blurred content area */}
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="glass-panel p-6 md:p-8 max-w-md w-full border-2 border-[color:var(--accent-primary)]/30 bg-[color:var(--background-overlay)]/95 backdrop-blur-sm z-10">
          <div className="text-center space-y-4 md:space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[color:var(--accent-primary)] to-[color:var(--accent-warm)] mb-3 md:mb-4">
              <span className="text-xl md:text-2xl font-bold text-white">🔒</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-[color:var(--text-primary)]">
              Upgrade to Growth Seat
            </h3>
            
            <p className="text-sm md:text-base text-[color:var(--text-secondary)] leading-relaxed">
              This content is part of the exclusive Founder Hub community. 
              Upgrade your membership to access full benchmarking data, 
              private discussions, and the complete founder network.
            </p>
            
            <div className="space-y-2 md:space-y-3 pt-2 md:pt-4">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[color:var(--accent-primary)]" />
                <span className="text-xs md:text-sm text-[color:var(--text-secondary)]">Full Benchmarking Access</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[color:var(--accent-primary)]" />
                <span className="text-xs md:text-sm text-[color:var(--text-secondary)]">Private Founder Community</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[color:var(--accent-primary)]" />
                <span className="text-xs md:text-sm text-[color:var(--text-secondary)]">War Room Discussions</span>
              </div>
            </div>
            
            <Link 
              href="/billing"
              className="inline-block w-full mt-4 md:mt-6 btn-primary py-3 md:py-4 rounded-lg text-base md:text-lg font-bold text-center"
            >
              Upgrade Now – $20/month
            </Link>
            
            <p className="text-xs text-[color:var(--text-tertiary)] mt-2 md:mt-4">
              Early member rate • Cancel anytime • Price locked at $20/mo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}