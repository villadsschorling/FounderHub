"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { moneyPosts, socialPosts } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HomeDashboard() {
  // Get a few recent items from different sections
  const recentMoney = moneyPosts.slice(0, 2);
  const recentSocial = socialPosts.slice(0, 2);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-12 max-w-6xl mx-auto pb-20"
    >
      {/* Welcome Section */}
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[color:var(--text-primary)]">
            Welcome back, Founder
          </h1>
          <p className="text-lg text-[color:var(--text-secondary)] mt-2">
            Here's what's happening across the Hub today.
          </p>
        </div>
        
        {/* Pricing Notice - Subtle Professional Version */}
        <Link href="/subscription">
          <motion.div 
            whileHover={{ y: -2, borderColor: "var(--accent-warm)" }}
            className="glass-panel px-6 py-4 border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)] cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[color:var(--background-overlay)] border border-[color:var(--border-subtle)] flex items-center justify-center text-lg group-hover:border-[color:var(--accent-warm)] transition-colors">
                🗓️
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-tertiary)]">Membership Update</p>
                <p className="text-sm font-medium text-[color:var(--text-primary)] mt-0.5">
                  Growth seat adjusting to <span className="font-bold text-[color:var(--accent-warm)]">$35/mo</span> on April 1st
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-[color:var(--text-tertiary)]">Current members keep legacy rates.</span>
                  <span className="text-[10px] font-bold text-[color:var(--accent-primary)] group-hover:underline">View details →</span>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Founders", value: "0", trend: "Hub initialized", icon: "👥" },
          { label: "Live Discussions", value: "0", trend: "Wait for it", icon: "💬" },
          { label: "Opportunities", value: "0", trend: "Fresh start", icon: "💰" },
          { label: "Upcoming Events", value: "0", trend: "Check later", icon: "🗓️" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-panel p-6 flex flex-col items-center text-center gap-2"
          >
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--text-tertiary)]">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              <p className="text-[10px] font-medium text-green-600 mt-1">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Section (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Latest in Money Affairs */}
          <motion.section variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)]">Recent in Money Affairs</h2>
              <Link href="/money">
                <motion.span 
                  whileHover={{ x: 5, color: "var(--accent-warm)" }}
                  className="text-sm font-semibold text-[color:var(--accent-primary)] cursor-pointer inline-block"
                >
                  View all →
                </motion.span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {recentMoney.map((post) => (
                <Link key={post.id} href={`/money/${post.id}`}>
                  <motion.div 
                    whileHover={{ x: 4, borderColor: "var(--accent-primary)" }}
                    className="glass-panel p-5 border border-[color:var(--border-subtle)] transition-colors bg-[color:var(--background-overlay)]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--accent-primary)]">{post.section}</span>
                      <span className="text-[10px] text-[color:var(--text-tertiary)]">{post.timestamp}</span>
                    </div>
                    <h3 className="font-semibold text-[color:var(--text-primary)]">{post.title}</h3>
                    <p className="text-sm text-[color:var(--text-secondary)] line-clamp-1 mt-1">{post.content}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Latest in Social Hub */}
          <motion.section variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)]">Community Socials</h2>
              <Link href="/social">
                <motion.span 
                  whileHover={{ x: 5, color: "var(--accent-primary)" }}
                  className="text-sm font-semibold text-[color:var(--accent-primary)] cursor-pointer inline-block"
                >
                  Explore hub →
                </motion.span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentSocial.map((post) => (
                <Link key={post.id} href={`/social/${post.id}`}>
                  <motion.div 
                    whileHover={{ y: -4, borderColor: "var(--accent-warm)" }}
                    className="glass-panel p-5 border border-[color:var(--border-subtle)] transition-colors bg-[color:var(--background-overlay)]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--accent-warm)]">{post.category}</span>
                    </div>
                    <h3 className="font-semibold text-[color:var(--text-primary)]">{post.title}</h3>
                    <p className="text-xs text-[color:var(--text-secondary)] mt-2 line-clamp-2">{post.content}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar Section (1/3 width) */}
        <div className="flex flex-col gap-8">
          {/* Quick Actions */}
          <motion.section variants={itemVariants} className="glass-panel p-6 bg-[color:var(--accent-gradient)] text-white">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link href="/benchmarking">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-white/20 rounded-lg text-sm font-bold transition-colors text-left px-4 flex items-center justify-between"
                >
                  Sync Metrics <span>📊</span>
                </motion.button>
              </Link>
              <Link href="/war-room">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-white/20 rounded-lg text-sm font-bold transition-colors text-left px-4 flex items-center justify-between"
                >
                  Post to War Room <span>🔥</span>
                </motion.button>
              </Link>
              <Link href="/directory">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-white/20 rounded-lg text-sm font-bold transition-colors text-left px-4 flex items-center justify-between"
                >
                  Find a Mentor <span>🤝</span>
                </motion.button>
              </Link>
            </div>
          </motion.section>

          </div>
      </div>
    </motion.div>
  );
}
