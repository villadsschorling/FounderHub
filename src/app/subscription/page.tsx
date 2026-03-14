"use client";

import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";

export default function SubscriptionPage() {
  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-10"
        >
          {/* Header */}
          <header className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-[color:var(--text-primary)]">
              Your Subscription
            </h1>
            <p className="text-lg text-[color:var(--text-secondary)]">
              Manage your membership, billing, and upcoming plan adjustments.
            </p>
          </header>

          {/* Current Plan Card */}
          <section className="glass-panel p-8 border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="pill-badge bg-green-500/10 text-green-600 border border-green-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                Active
              </span>
            </div>
            
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--text-tertiary)] mb-2">Current Plan</p>
                <h2 className="text-3xl font-bold text-[color:var(--text-primary)]">Growth Seat</h2>
                <p className="text-[color:var(--text-secondary)] mt-1">Full access to the Founder Hub, War Room, and Benchmarking tools.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-[color:var(--border-subtle)]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-tertiary)]">Monthly Cost</p>
                  <p className="text-2xl font-bold text-[color:var(--text-primary)] mt-1">$20.00 <span className="text-sm font-normal text-[color:var(--text-tertiary)]">/ month</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-tertiary)]">Next Billing Date</p>
                  <p className="text-2xl font-bold text-[color:var(--text-primary)] mt-1">April 1st, 2026</p>
                </div>
              </div>

              {/* Pricing Notice Adjustment */}
              <div className="bg-[color:var(--background-overlay)] border border-[color:var(--accent-warm)]/30 rounded-xl p-6 flex items-start gap-4">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h3 className="font-bold text-[color:var(--text-primary)]">Upcoming Pricing Adjustment</h3>
                  <p className="text-sm text-[color:var(--text-secondary)] mt-1 leading-relaxed">
                    Starting <span className="font-bold text-[color:var(--text-primary)]">April 1st, 2026</span>, the new rate for the Growth Seat will be <span className="font-bold text-[color:var(--accent-warm)]">$35/mo</span>. 
                    As an early member, your rate is locked at $20/mo for as long as your subscription remains active.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Billing History Placeholder */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-[color:var(--text-primary)]">Billing History</h2>
            <div className="glass-panel border border-[color:var(--border-subtle)] divide-y divide-[color:var(--border-subtle)]">
              {[
                { date: "Mar 1, 2026", amount: "$20.00", status: "Paid", id: "#INV-2026-003" },
                { date: "Feb 1, 2026", amount: "$20.00", status: "Paid", id: "#INV-2026-002" },
                { date: "Jan 1, 2026", amount: "$20.00", status: "Paid", id: "#INV-2026-001" },
              ].map((inv, i) => (
                <div key={i} className="flex items-center justify-between p-4 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-[color:var(--text-primary)]">{inv.date}</span>
                    <span className="text-[10px] text-[color:var(--text-tertiary)]">{inv.id}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-[color:var(--text-primary)]">{inv.amount}</span>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">
                      {inv.status}
                    </span>
                    <button className="text-[color:var(--accent-primary)] hover:underline font-semibold text-xs">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cancellation Option */}
          <footer className="pt-10 border-t border-[color:var(--border-subtle)]">
            <button className="text-[color:var(--text-tertiary)] hover:text-red-500 text-xs font-medium transition-colors">
              Looking to cancel your membership? Click here.
            </button>
          </footer>
        </motion.div>
      </div>
    </Sidebar>
  );
}
