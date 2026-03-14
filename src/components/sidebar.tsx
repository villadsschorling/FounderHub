 "use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const navItems: { href: string; label: string; hasIndicator?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/benchmarking", label: "Benchmarking" },
  { href: "/war-room", label: "War Room" },
  { href: "/directory", label: "Member Directory" },
  { href: "/money", label: "Money Affairs" },
  { href: "/social", label: "Social" },
  { href: "/private", label: "Private Chat", hasIndicator: true },
  { href: "/profile", label: "My Profile" },
  { href: "/subscription", label: "Your Subscription" },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    async function checkUnread() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { count } = await supabase
        .from('private_messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', profile.id)
        .eq('is_read', false);

      setHasUnread((count || 0) > 0);

      // Real-time subscription for new messages
      const channel = supabase
        .channel('sidebar_unread_messages')
        .on('postgres_changes', {
          event: '*', // Listen for inserts and updates (marking as read)
          schema: 'public',
          table: 'private_messages',
          filter: `recipient_id=eq.${profile.id}`
        }, () => {
          // Re-check count on any change to my messages
          supabase
            .from('private_messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', profile.id)
            .eq('is_read', false)
            .then(({ count: newCount }: { count: number | null }) => {
              setHasUnread((newCount || 0) > 0);
            });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    checkUnread();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="app-shell flex min-h-screen text-[color:var(--text-primary)]">
      <aside className="glass-panel flex w-64 flex-col px-6 py-6 border-r border-[color:var(--border-subtle)]">
        <div className="mb-10">
          <div className="pill-badge inline-flex items-center gap-2 px-3 py-1 text-[11px] font-medium text-[color:var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-warm)] shadow-[0_0_12px_rgba(244,162,97,0.95)]" />
            Founder Hub
          </div>
          <div className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
            Operator dashboard
          </div>
        </div>
        <nav className="space-y-6 text-sm font-medium text-[color:var(--text-secondary)] flex-1 mt-12">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex items-center justify-between rounded-md px-3 py-4 text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--background-overlay)] hover:text-[color:var(--text-primary)]"
              >
                <div className="flex items-center">
                  <span className="h-1 w-1 rounded-full bg-[color:var(--accent-primary)]" />
                  <span className="ml-4 tracking-tight">{item.label}</span>
                </div>
                {item.hasIndicator && hasUnread && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"></span>
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto space-y-6 pt-10">
          <div className="glass-panel--subtle rounded-lg px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
              Membership
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
              Growth seat – $20 / mo
            </p>
            <p className="mt-1 text-[9px] leading-tight text-[color:var(--accent-warm)] font-bold">
              Price rising to $35 on April 1st
            </p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--background-overlay)] hover:text-red-400 group"
          >
            <span className="h-1 w-1 rounded-full bg-red-400 group-hover:animate-pulse" />
            <span className="ml-3 font-medium text-xs uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 px-10 py-10 overflow-y-auto">{children}</main>
    </div>
  );
}

