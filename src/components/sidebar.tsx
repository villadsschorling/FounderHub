 "use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Benchmarking" },
  { href: "/war-room", label: "War Room" },
  { href: "/directory", label: "Member Directory" },
  { href: "/tools", label: "Tools" },
  { href: "/money", label: "Money Affairs" },
  { href: "/social", label: "Social" },
  { href: "/private", label: "Private Chat" },
];

export function Sidebar({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen text-[color:var(--text-primary)]">
      <aside className="glass-panel flex w-64 flex-col px-6 py-6">
        <div className="mb-10">
          <div className="pill-badge inline-flex items-center gap-2 px-3 py-1 text-[11px] font-medium text-[color:var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-warm)] shadow-[0_0_12px_rgba(244,162,97,0.95)]" />
            Founder Hub
          </div>
          <div className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
            Operator dashboard
          </div>
        </div>
        <nav className="space-y-1 text-sm font-medium text-[color:var(--text-secondary)]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex items-center rounded-md px-3 py-2 text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--background-overlay)] hover:text-[color:var(--text-primary)]"
              >
                <span className="h-1 w-1 rounded-full bg-[color:var(--accent-primary)]" />
                <span className="ml-3">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10 text-xs text-[color:var(--text-secondary)]">
          <div className="glass-panel--subtle rounded-lg px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
              Membership
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
              Growth seat – $20 / mo
            </p>
            <p className="mt-1 text-[11px] text-[color:var(--text-secondary)]">
              Stripe paywall coming next. Keep this tab open.
            </p>
          </div>
        </div>
      </aside>
      <main className="flex-1 px-10 py-10">{children}</main>
    </div>
  );
}

