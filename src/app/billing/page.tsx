"use client";

import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setSubscriptionStatus(profile.subscription_status || 'inactive');
      }
      setLoading(false);
    }

    checkSubscription();
  }, [supabase, router]);

  const handleActivate = async () => {
    alert('Stripe integration coming soon!');
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <p className="text-[color:var(--text-tertiary)] animate-pulse">Loading billing information...</p>
        </div>
      </Sidebar>
    );
  }

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
              Billing
            </h1>
            <p className="text-lg text-[color:var(--text-secondary)]">
              Manage your membership, billing, and subscription status.
            </p>
          </header>

          {/* Current Plan Card */}
          <section className="glass-panel p-8 border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`pill-badge ${subscriptionStatus === 'active' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'} px-3 py-1 text-[10px] font-bold uppercase tracking-widest`}>
                {subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-tertiary)]">Status</p>
                  <p className="text-2xl font-bold text-[color:var(--text-primary)] mt-1 capitalize">{subscriptionStatus}</p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[color:var(--text-primary)]">Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                    <span className="text-[color:var(--text-secondary)]">Full Benchmarking Access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                    <span className="text-[color:var(--text-secondary)]">Private Founder Community</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                    <span className="text-[color:var(--text-secondary)]">War Room Discussions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                    <span className="text-[color:var(--text-secondary)]">Member Directory Access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                    <span className="text-[color:var(--text-secondary)]">Private Chat with Founders</span>
                  </li>
                </ul>
              </div>

              {/* Activate Button */}
              {subscriptionStatus === 'inactive' && (
                <div className="mt-6 pt-6 border-t border-[color:var(--border-subtle)]">
                  <button
                    onClick={handleActivate}
                    className="w-full btn-primary py-4 rounded-lg text-lg font-bold flex items-center justify-center gap-3"
                  >
                    <span>Activate Growth Seat</span>
                    <span className="text-sm">→</span>
                  </button>
                  <p className="text-center text-sm text-[color:var(--text-tertiary)] mt-3">
                    One-time activation • $20/month • Cancel anytime
                  </p>
                </div>
              )}

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
          {subscriptionStatus === 'active' && (
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
          )}

          {/* Cancellation Option */}
          {subscriptionStatus === 'active' && (
            <footer className="pt-10 border-t border-[color:var(--border-subtle)]">
              <button className="text-[color:var(--text-tertiary)] hover:text-red-500 text-xs font-medium transition-colors">
                Looking to cancel your membership? Click here.
              </button>
            </footer>
          )}
        </motion.div>
      </div>
    </Sidebar>
  );
}