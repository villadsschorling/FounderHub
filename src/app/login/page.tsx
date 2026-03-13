 "use client";

import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-panel w-full max-w-md border border-[color:var(--border-subtle)] px-6 py-7"
      >
        <div className="mb-6">
          <div className="pill-badge inline-flex items-center gap-2 px-3 py-1 text-[11px] font-medium text-[color:var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-warm)] shadow-[0_0_10px_rgba(244,162,97,0.9)]" />
            Founder Hub Access
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
            Sign in to your hub
          </h1>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
            Account access is paywalled at{" "}
            <span className="font-medium text-[color:var(--accent-primary)]">
              $20/month
            </span>
            . We&apos;ll wire up Stripe next.
          </p>
        </div>

        <form className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
              Work email
            </label>
            <div className="input-shell px-3 py-2">
              <input
                type="email"
                placeholder="you@company.com"
                className="h-7 w-full bg-transparent text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
              Password
            </label>
            <div className="input-shell px-3 py-2">
              <input
                type="password"
                placeholder="••••••••"
                className="h-7 w-full bg-transparent text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-primary mt-3 inline-flex w-full items-center justify-center px-3 py-2 text-sm font-medium"
          >
            Continue to dashboard
          </button>
        </form>

        <p className="mt-4 text-[11px] text-[color:var(--text-tertiary)]">
          By continuing you agree to the operator terms. Real auth + billing
          coming in the next iteration.
        </p>
      </motion.div>
    </div>
  );
}

